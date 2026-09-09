import { useState } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const BOT_REPLIES: Record<string, string> = {
  hello: "Hi there! Welcome to Toy Shop Pakistan. How can I help you today?",
  hi: "Hey! How can I assist you?",
  help: "I can help with:\n- Order tracking\n- Product recommendations\n- Shipping info\n- Return policy\nJust type your question!",
  order: "To track your order, go to My Orders in your account or visit /orders/track/:orderNumber. Need help with something specific?",
  shipping: "We offer:\n- Standard: 3-5 days (Free over Rs. 3,000)\n- Express: 1-2 days (Rs. 500)\n- Same Day: Karachi & Lahore (Rs. 800)",
  return: "Our return policy: 7 days from delivery. Items must be unused in original packaging. Go to your order and click 'Request Return'.",
  payment: "We accept:\n- Cash on Delivery (COD)\n- Debit/Credit cards\n- Bank transfer\nAll payments are secure!",
  default: "Thanks for your message! Our team will get back to you shortly. For urgent queries, call us at 0300-1234567.",
}

function getBotReply(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (key !== 'default' && lower.includes(key)) return reply
  }
  return BOT_REPLIES.default
}

export default function LiveChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! Welcome to Toy Shop Pakistan. I'm here to help. Ask me anything about orders, shipping, products, or returns!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])

  const onSend = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now(), text: input.trim(), sender: 'user', timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, text: getBotReply(userMsg.text), sender: 'bot', timestamp: new Date() }
      setMessages((prev) => [...prev, botMsg])
    }, 800)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <>
      {/* Chat Widget */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          open ? 'bg-red-500 hover:bg-red-600 rotate-0' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {open ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-80 rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-96">
          {/* Header */}
          <div className="rounded-t-2xl bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Toy Shop Support</p>
                <p className="text-xs text-blue-200">Typically replies instantly</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {msg.sender === 'user' ? <User className="h-3.5 w-3.5 text-blue-600" /> : <Bot className="h-3.5 w-3.5 text-gray-600" />}
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={onSend}
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">Powered by Toy Shop Support</p>
          </div>
        </div>
      )}
    </>
  )
}
