import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { Play, Pause } from "lucide-react";

function formatMessage(content) {
  // Convert new lines to <br>, and lists to proper HTML
  return content
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold**
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // *italic*
    .replace(/- (.*?)\n/g, "<li>$1</li>") // Bullet points
    .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>"); // Wrap list items in <ul>
}

export default function ChatMessage({ message }) {
  const { content, sender, files } = message;
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`chat-message ${
        sender === "user" ? "user-message" : "bot-message"
      }`}
    >
      {/*<div className="message-avatar">
        {sender === "user" ? (
          <Avatar>
            <AvatarImage src="/logo.png" alt="User" />
          </Avatar>
        ) : (
          <Avatar>
            <AvatarImage src="/logo.png" alt="mediBOT" />
          </Avatar>
        )}
      </div>*/}

      <div className="message-content">
        {files && files.length > 0 && (
          <div className="message-files">
            {files.map((file, index) => (
              <div key={index} className="message-file">
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt={file.name}
                    className="message-image"
                  />
                ) : file.type.startsWith("video/") ? (
                  <video controls className="message-video">
                    <source src={file.url} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="message-file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
        ></div>
        {sender === "bot" && (
          <button
            onClick={toggleSpeech}
            className="speech-button"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="icon" /> : <Play className="icon" />}
          </button>
        )}
      </div>
    </div>
  );
}
