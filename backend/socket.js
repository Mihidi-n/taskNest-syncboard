import { Server } from 'socket.io'

let io = null

export function initSocket(httpServer, corsOrigins) {
  io = new Server(httpServer, {
    cors: { origin: corsOrigins },
  })

  io.on('connection', (socket) => {
    
    socket.on('joinBoard', (boardId) => {
      
      socket.join(`board:${boardId}`)
    })
    socket.on('leaveBoard', (boardId) => {
      socket.leave(`board:${boardId}`)
    })
  })

  return io
}

export function notifyBoardChanged(boardId) {
  if (!io) return
  io.to(`board:${boardId}`).emit('board:changed', { boardId })
}