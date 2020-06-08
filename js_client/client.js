  (()=>{
  const socket = io.connect('http://localhost:8080');

  document.addEventListener('keydown',(e)=>
    {
      console.log(e);
      
      console.log(player);
            
      //const posX = e.clientX; console.log(posX);
      
      
      //const posY = e.clientY;
      socket.emit('keypress', player.x);
      console.log('client emit');
      
    }
  )


  socket.on('newPos',(data)=>
    {
      console.log('client', data);
      console.log('client receve');
      player.x = data
    }
  )
})()