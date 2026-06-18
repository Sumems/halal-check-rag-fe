import type { Route } from "./+types/chat";
import type { ChatStatus } from "ai";
import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router";
import { nanoid } from "nanoid";
import {
  FaArrowLeft,
  FaImage,
  FaMosque,
  FaMoon,
  FaSun,
  FaUtensils,
  FaCertificate,
  FaFlask,
  FaXmark,
} from "react-icons/fa6";
import { cn } from "~/lib/utils";
import { useTheme } from "~/lib/theme";
import { HalalLogoIcon } from "~/components/HalalLogoIcon";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Loader } from "~/components/ai-elements/loader";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "~/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  usePromptInputAttachments,
} from "~/components/ai-elements/prompt-input";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat - Halal Check" },
    {
      name: "description",
      content:
        "Tanya jawab interaktif tentang kehalalan produk dengan AI chatbot",
    },
    {
      name: "keywords",
      content: "halal, chatbot, cek halal, BPJPH, sertifikasi halal, AI",
    },
  ];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: UploadedImage[];
}

interface UploadedImage {
  url: string;
  filename?: string;
  mediaType?: string;
}

interface SuggestionItem {
  label: string;
  icon: React.ReactNode;
}

interface StreamChunk {
  type: "begin" | "item" | "end" | "error";
  content?: string;
  metadata?: {
    nodeId: string;
    nodeName: string;
  };
}

const PROXY_URL = "/api/chat";

const SUGGESTION_ITEMS: SuggestionItem[] = [
  {
    label: "Apakah Indomie goreng sudah bersertifikat halal?",
    icon: <FaUtensils className="text-green-600 dark:text-green-400" />,
  },
  {
    label: "Bagaimana cara cek sertifikat halal BPJPH?",
    icon: <FaCertificate className="text-green-600 dark:text-green-400" />,
  },
  {
    label: "Apa bedanya label halal BPJPH dan MUI?",
    icon: <FaMosque className="text-green-600 dark:text-green-400" />,
  },
  {
    label: "Produk kosmetik apa yang sudah bersertifikat halal?",
    icon: <FaFlask className="text-green-600 dark:text-green-400" />,
  },
];

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replaceAll("-", "");
  }
  return nanoid();
}

const MAX_IMAGE_DIMENSION = 1024;
const JPEG_QUALITY = 0.7;
const MAX_FILE_SIZE_BYTES = 500 * 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function compressImage(dataUrl: string): Promise<Blob> {
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    const ratio = Math.min(
      MAX_IMAGE_DIMENSION / width,
      MAX_IMAGE_DIMENSION / height
    );
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  let quality = JPEG_QUALITY;
  let blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/jpeg", quality)
  );

  while (blob.size > MAX_FILE_SIZE_BYTES && quality > 0.3) {
    quality -= 0.1;
    blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg", quality)
    );
  }

  return blob;
}

async function dataUrlToCompressedFile(
  dataUrl: string,
  filename: string
): Promise<File> {
  const blob = await compressImage(dataUrl);
  const compressedName = filename.replace(/\.\w+$/, ".jpg") || "image.jpg";
  return new File([blob], compressedName, { type: "image/jpeg" });
}

export default function Chat() {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [sessionId] = useState(generateSessionId);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string, images: UploadedImage[] = []) => {
      const trimmed = text.trim();
      if (!trimmed && images.length === 0) return;

      const userMessage: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: trimmed,
        images,
      };

      setMessages((prev) => [...prev, userMessage]);
      setStatus("submitted");

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const assistantId = nanoid();

      try {
        let response: Response;

        if (images.length > 0) {
          const formData = new FormData();
          formData.append("sessionId", sessionId);
          formData.append("action", "sendMessage");
          formData.append("chatInput", trimmed);

          for (const image of images) {
            if (!image.url) continue;
            const file = await dataUrlToCompressedFile(
              image.url,
              image.filename ?? "image.jpg"
            );
            formData.append("data", file);
          }

          response = await fetch(PROXY_URL, {
            method: "POST",
            headers: { Accept: "text/plain" },
            body: formData,
            signal: controller.signal,
          });
        } else {
          response = await fetch(PROXY_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "text/plain",
            },
            body: JSON.stringify({
              sessionId,
              action: "sendMessage",
              chatInput: trimmed,
            }),
            signal: controller.signal,
          });
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        if (response.body) {
          setStatus("streaming");
          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: "assistant", content: "" },
          ]);

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";
          let buffer = "";
          let activeNodeId = "";

          try {
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() ?? "";

              for (const line of lines) {
                if (!line.trim()) continue;

                let chunk: StreamChunk;
                try {
                  chunk = JSON.parse(line);
                } catch {
                  chunk = { type: "item", content: line };
                }

                if (chunk.type === "begin" && !activeNodeId && chunk.metadata) {
                  activeNodeId = chunk.metadata.nodeId;
                }

                const isActiveNode =
                  !chunk.metadata || chunk.metadata.nodeId === activeNodeId;

                if (chunk.type === "item" && chunk.content && isActiveNode) {
                  accumulated += chunk.content;
                } else if (chunk.type === "error" && chunk.content) {
                  accumulated += `Error: ${chunk.content}`;
                }
              }

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, content: accumulated }
                    : msg
                )
              );
            }
          } finally {
            reader.releaseLock();
          }

          if (!accumulated.trim()) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content:
                        "Tidak ada respons yang diterima. Silakan coba lagi.",
                    }
                  : msg
              )
            );
          }

          setStatus("ready");
        } else {
          const data = await response.json();
          const assistantText =
            data.output ?? data.text ?? data.message ?? data.response ?? "";

          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: "assistant", content: assistantText },
          ]);
          setStatus("ready");
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        setMessages((prev) => [
          ...prev,
          {
            id: nanoid(),
            role: "assistant",
            content:
              "Maaf, terjadi kesalahan saat menghubungi server. Silakan coba lagi dalam beberapa saat.",
          },
        ]);
        setStatus("ready");
      }
    },
    [sessionId]
  );

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    setStatus("ready");
  }, []);

  const handleSubmit = useCallback(
    (message: {
      text: string;
      files: Array<{ url?: string; filename?: string; mediaType?: string }>;
    }) => {
      const imageFiles: UploadedImage[] = message.files
        .filter(
          (file) =>
            file.mediaType?.startsWith("image/") && Boolean(file.url)
        )
        .map((file) => ({
          url: file.url as string,
          filename: file.filename,
          mediaType: file.mediaType,
        }));

      return sendMessage(message.text, imageFiles);
    },
    [sendMessage]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage(suggestion);
    },
    [sendMessage]
  );

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-green-200 bg-white px-4 py-3 shadow-sm dark:border-green-800 dark:bg-green-950">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center justify-center rounded-lg p-2 text-green-700 transition-colors hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-400 dark:text-green-300 dark:hover:bg-green-900 dark:focus-visible:ring-green-600"
            aria-label="Kembali ke beranda"
          >
            <FaArrowLeft className="text-lg" />
          </Link>
          <div className="flex items-center gap-2">
            <HalalLogoIcon className="size-7 text-green-600 dark:text-green-400" />
            <h1 className="text-lg font-semibold text-green-950 dark:text-green-100">
              Halal Check
            </h1>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-green-700 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-900"
              aria-label={
                theme === "dark"
                  ? "Beralih ke mode siang"
                  : "Beralih ke mode malam"
              }
            >
              {theme === "dark" ? (
                <FaSun className="size-5" />
              ) : (
                <FaMoon className="size-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{theme === "dark" ? "Mode siang" : "Mode malam"}</p>
          </TooltipContent>
        </Tooltip>
      </header>

      {/* Area Percakapan */}
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6">
          {messages.length === 0 ? (
            <EmptyState
              onSuggestionClick={handleSuggestionClick}
              isLoading={isLoading}
            />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <LoadingBubble />}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Area Input */}
      <footer className="border-t border-green-200 bg-white px-4 pb-4 pt-3 dark:border-green-800 dark:bg-green-950">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            accept="image/*"
            maxFiles={3}
            onSubmit={handleSubmit}
            className="rounded-xl border-green-200 shadow-md transition-shadow focus-within:border-green-400 focus-within:shadow-lg dark:border-green-700 dark:bg-green-900 dark:focus-within:border-green-600"
          >
            <ImageAttachmentPreview />
            <PromptInputTextarea
              placeholder="Tanyakan seputar kehalalan produk (bisa upload gambar)..."
              disabled={isLoading}
            />
            <PromptInputFooter>
              <div className="flex items-center">
                <ImageUploadButton disabled={isLoading} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Tekan Enter untuk mengirim
                </span>
                <PromptInputSubmit
                  status={status}
                  onStop={handleStop}
                  disabled={isLoading && status !== "streaming"}
                  className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-green-950 dark:hover:bg-green-400"
                />
              </div>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </footer>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <Message from={message.role}>
      <MessageContent
        className={cn(
          message.role === "user" &&
            "bg-green-100 text-green-950 dark:bg-green-900 dark:text-green-100",
          message.role === "assistant" &&
            "text-green-950 dark:text-green-100"
        )}
      >
        {message.role === "assistant" ? (
          <MessageResponse className="prose-chat leading-relaxed [&>p]:mb-3 [&>p]:last:mb-0 [&>p]:leading-[1.7]">
            {message.content}
          </MessageResponse>
        ) : (
          <div className="space-y-3">
            {message.images && message.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {message.images.map((image, index) => (
                  <img
                    key={`${message.id}-image-${index}`}
                    src={image.url}
                    alt={image.filename ?? `Gambar ${index + 1}`}
                    className="h-24 w-full rounded-md object-cover"
                  />
                ))}
              </div>
            )}
            {message.content && <p>{message.content}</p>}
          </div>
        )}
      </MessageContent>
    </Message>
  );
}

const MAX_IMAGES = 3;

function ImageUploadButton({ disabled }: { disabled: boolean }) {
  const attachments = usePromptInputAttachments();
  const imageCount = attachments.files.filter((f) =>
    f.mediaType?.startsWith("image/")
  ).length;
  const isAtLimit = imageCount >= MAX_IMAGES;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isAtLimit}
            onClick={attachments.openFileDialog}
            className="border-green-300 bg-green-50 text-green-800 hover:bg-green-100 dark:border-green-700 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800"
          >
            <FaImage className="mr-1 size-4" />
            Upload Gambar (Maks. {MAX_IMAGES})
          </Button>
        </span>
      </TooltipTrigger>
      {isAtLimit && (
        <TooltipContent>
          <p>Maksimal {MAX_IMAGES} gambar</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}

function ImageAttachmentPreview() {
  const attachments = usePromptInputAttachments();
  const imageFiles = attachments.files.filter((file) =>
    file.mediaType?.startsWith("image/")
  );

  if (imageFiles.length === 0) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2 px-1 pt-1">
      {imageFiles.map((file) => (
        <div
          key={file.id}
          className="relative h-16 w-16 overflow-hidden rounded-md border border-green-200 dark:border-green-700"
        >
          <img
            src={file.url}
            alt={file.filename ?? "Preview gambar"}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            className="absolute right-1 top-1 cursor-pointer rounded-full bg-black/60 p-1 text-white transition hover:bg-black/75"
            onClick={() => attachments.remove(file.id)}
            aria-label={`Hapus ${file.filename ?? "gambar"}`}
          >
            <FaXmark className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function LoadingBubble() {
  return (
    <Message from="assistant">
      <MessageContent>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Loader size={16} />
          {/* <span className="text-sm">Sedang memproses...</span> */}
        </div>
      </MessageContent>
    </Message>
  );
}

function EmptyState({
  onSuggestionClick,
  isLoading,
}: {
  onSuggestionClick: (suggestion: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900">
          <HalalLogoIcon className="size-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-green-950 dark:text-green-100">
          Asisten Halal Check
        </h2>
        <p className="max-w-md text-sm text-green-700 dark:text-green-400">
          Tanyakan apa saja tentang status kehalalan produk makanan, minuman,
          atau kosmetik di Indonesia
        </p>
      </div>

      <div className="w-full max-w-xl">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-green-600 dark:text-green-500">
          Coba tanyakan
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SUGGESTION_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSuggestionClick(item.label)}
              disabled={isLoading}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border border-green-200 bg-white p-4 text-left text-sm transition-all",
                "hover:border-green-400 hover:bg-green-50 hover:shadow-sm",
                "focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:outline-none dark:focus-visible:ring-green-600",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "dark:border-green-700 dark:bg-green-900 dark:hover:border-green-500 dark:hover:bg-green-800"
              )}
            >
              <span className="mt-0.5 shrink-0">{item.icon}</span>
              <span className="text-green-800 dark:text-green-200">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
