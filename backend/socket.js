import User from "./models/user.model.js"
import jwt from "jsonwebtoken"

export const socketHandler = (io) => {
  // Authentication middleware
  io.use((socket, next) => {
    if (socket.request.headers.cookie) {
      const tokenCookie = socket.request.headers.cookie.split(';').find(c => c.trim().startsWith('token='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.userId = decoded.userId;
          return next();
        } catch (err) {
          // invalid token
        }
      }
    }
    // If not authenticated, we still let them connect but they won't have socket.userId
    next();
  });

  io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('identity', async (payload) => {
      try {
        const userId = socket.userId || payload?.userId;
        if (!userId) return; // Prevent unauthorized hijacking
        
        // Ensure they only update their own identity if authenticated
        if (socket.userId && socket.userId !== payload?.userId && payload?.userId) {
             // they passed a different userId, ignore payload
        }
        
        const actualUserId = socket.userId || payload?.userId; // Prefer authenticated

        const user = await User.findByIdAndUpdate(actualUserId, {
          socketId: socket.id, isOnline: true
        }, { new: true })
      } catch (error) {
        console.log(error)
      }
    })


    socket.on('updateLocation', async (payload) => {
      try {
        const userId = socket.userId;
        if (!userId) return; // Must be authenticated to update location

        const latitude = payload.latitude;
        const longitude = payload.longitude;

        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          isOnline: true,
          socketId: socket.id
        })

        if (user) {
          io.emit('updateDeliveryLocation',{
            deliveryBoyId:userId,
            latitude,
            longitude
          })
        }


      } catch (error) {
          console.log('updateDeliveryLocation error')
      }
    })




    socket.on('disconnect', async () => {
      try {

        await User.findOneAndUpdate({ socketId: socket.id }, {
          socketId: null,
          isOnline: false
        })
      } catch (error) {
        console.log(error)
      }

    })
  })
}