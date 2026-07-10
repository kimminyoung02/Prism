import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, Zap, ZapOff, Image as ImageIcon } from "lucide-react"

export default function PrismLensPage() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [flashOn, setFlashOn] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("카메라를 사용할 수 없어요")
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        if (!cancelled) setCameraReady(true)
      } catch {
        if (!cancelled) {
          setCameraError("카메라 권한이 필요해요")
        }
      }
    }

    startCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const goToAnalyzing = (image: string) => {
    navigate("/lens/analyzing", { state: { image } })
  }

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    goToAnalyzing(canvas.toDataURL("image/jpeg", 0.85))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        goToAnalyzing(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex min-h-svh flex-col bg-brand-600">
      <div className="flex items-center justify-between px-5 pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="닫기"
          className="-m-2 rounded-full p-2 text-white/90 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={24} />
        </button>
        <button
          type="button"
          onClick={() => setFlashOn((v) => !v)}
          aria-label={flashOn ? "플래시 끄기" : "플래시 켜기"}
          aria-pressed={flashOn}
          className={
            "-m-2 rounded-full p-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white " +
            (flashOn ? "text-yellow-300" : "text-white/90 hover:text-white")
          }
        >
          {flashOn ? <Zap size={22} fill="currentColor" /> : <ZapOff size={22} />}
        </button>
      </div>

      <div className="relative flex-1">
        <div className="absolute inset-6 overflow-hidden rounded-2xl bg-black/40">
          {cameraError ? (
            <div className="flex h-full items-center justify-center px-8 text-center">
              <p className="text-sm text-white/60">{cameraError}</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
              <span aria-hidden="true" className="absolute left-3 top-3 h-8 w-8 border-l-4 border-t-4 border-white" />
              <span aria-hidden="true" className="absolute right-3 top-3 h-8 w-8 border-r-4 border-t-4 border-white" />
              <span aria-hidden="true" className="absolute bottom-3 left-3 h-8 w-8 border-b-4 border-l-4 border-white" />
              <span aria-hidden="true" className="absolute bottom-3 right-3 h-8 w-8 border-b-4 border-r-4 border-white" />
            </>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between px-8 pb-10 pt-6">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="갤러리에서 선택"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors duration-150 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ImageIcon size={20} />
        </button>

        <button
          type="button"
          onClick={handleCapture}
          disabled={!cameraReady || !!cameraError}
          aria-label="촬영"
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white/30 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600 disabled:opacity-40"
        >
          <span className="h-full w-full rounded-full bg-white transition-transform duration-150 active:scale-90" />
        </button>

        <div className="h-11 w-11" aria-hidden="true" />
      </div>
    </div>
  )
}
