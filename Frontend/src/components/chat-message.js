import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function ChatMessage({ message }) {
  const { content, sender, files } = message

  return (
    <div className={`chat-message ${sender === "user" ? "user-message" : "bot-message"}`}>
      <div className="message-avatar">
        {sender === "user" ? (
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="mediBOT" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="message-content">
        {files && files.length > 0 && (
          <div className="message-files">
            {files.map((file, index) => (
              <div key={index} className="message-file">
                {file.type.startsWith("image/") ? (
                  <img src={file.url || "/placeholder.svg"} alt={file.name} className="message-image" />
                ) : file.type.startsWith("video/") ? (
                  <video controls className="message-video">
                    <source src={file.url} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="message-file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="message-text">{content}</div>
      </div>
    </div>
  )
}

