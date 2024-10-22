import { useEffect, useState } from 'react'


function App() {

  const [Sets, setSets] = useState<any>([])
  const [CardsSet, setCardsSet] = useState<any>({ cards: [] })
  const [Card, setCard] = useState<any>({ name: '' })

  useEffect(() => {
    searchSets()
  }, [])

  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Track position
  const [positionStart, setPositionStart] = useState({ x: 0, y: 0 }); // Track position start

  // Called when mouse button is pressed
  const handleMouseDown = () => {
    setIsDragging(true); // Enable dragging
  };

  // Called when mouse button is released
  const handleMouseUp = () => {
    setIsDragging(false); // Disable dragging
    setPositionStart({x: 0, y: 0})
    setPosition({x: 0, y: 0})
  };

  // Called when mouse moves
  const handleMouseMove = (e: any) => {
    if (isDragging) {
      if(positionStart.x === 0 && positionStart.y === 0){
        setPositionStart({
          x: e.clientX,
          y: e.clientY,
        })
      }
      else{
        setPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    }
  };
  const handleTouchMove = (e: any) => {
    if (isDragging) {
      if(positionStart.x === 0 && positionStart.y === 0){
        setPositionStart({
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        })
      }
      else{
        setPosition({
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        });
      }
    }
  };

  const searchSets = async () => {
    setSets(await fetch('https://api.tcgdex.net/v2/en/sets/')
      .then((response: any) => response.json()))
  }

  const searchCardsSet = async (setId: string) => {
    setCardsSet(await fetch('https://api.tcgdex.net/v2/en/sets/' + setId)
      .then((response: any) => response.json()))
  }

  const searchCard = async (cardId: string) => {
    setCard(await fetch('https://api.tcgdex.net/v2/en/cards/' + cardId)
      .then((response: any) => response.json()))
  }

  const loadContent = () => {

    let content: any = []

    if (Card.name !== '') {

      const style = {
        // perspective: 'px',
        transition: "all .1s ease-out",
        backgroundImage: `url(${Card.image + '/high.png'})`,
        transform: `matrix3d(1, 0, 1, ${(positionStart.x - position.x) * -1 / 900000}, 0, 1, 0, ${(positionStart.y - position.y) * -1 / 900000}, -0.3400, 0, 1, 0, 1, 0, 10, 1) `,
        height: `${3.5*10}rem`,
        width: `${2.55*10}rem`,
        backgroundSize: 'cover',
        boxShadow: '0px 10px 50px rgba(0,0,0,0.8)',
        zindex: 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        margin: 0,
        padding: 0,
        boxsize: 'border-box',
        maxWidth: '100%',
        overflowx: 'hidden',
        borderRadius: '20px',
      };

      content =
        (<div key={'cards-' + Card.id} className='flex justify-center items-center flex-col h-[100vh] w-[100vw]'
          onMouseDown={handleMouseDown}  // Start dragging
          onMouseMove={handleMouseMove}  // Track mouse movement
          onMouseUp={handleMouseUp}      // Stop dragging
          onMouseLeave={handleMouseUp}   // Stop dragging if mouse leaves the area
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onTouchStart={handleMouseDown}
        >
          <div style={style}></div>
        </div>)
    }
    else if (CardsSet.cards.length > 0) {
      CardsSet.cards.map((x: any) => {

        const style = {
          backgroundImage: `url(${x.image + '/low.png'})`,
          height: `${3.5*5}rem`,
          width: `${2.55*5}rem`,
        }

        content.push
          (<button key={'cards-' + x.id} 
            style={style}
            onClick={() => searchCard(x.id)}
            className={`shadow-sm bg-no-repeat  bg-cover 
                      opacity-90 hover:opacity-100 backdrop-brightness-50 backdrop-contrast-0 transition-all duration-300`}
          />)

        // content.push
        //   (<div key={'cards-' + x.id} className='justify-evenly flex-grow h-full '>
        //     <button className='shadow-sm bg-transparent' key={'btn-' + x.id} onClick={() => searchCard(x.id)}>
        //       {
        //         x.image != null
        //           ? <img
        //             src={x.image + '/low.png'}
        //             alt={x.logo}
        //             className='backdrop-brightness-50 backdrop-contrast-0 transition-all'
        //           />
        //           : <p className='text-wrap'>{x.name}</p>
        //       }
        //     </button>
        //   </div>)
      })
    }
    else {
      Sets
        .filter((x: any) => x.logo != null)
        .map((x: any, index: number) => {

          const style = {
            backgroundImage: `url(${x.logo + '.png'})`,
          }

        content.push
          (<button key={'set-' + index} 
            style={style}
            onClick={() => searchCardsSet(x.id)}
            className='h-32 w-80 bg-slate-400 shadow-sm bg-no-repeat bg-center bg-contain p-7 
                      opacity-80 hover:opacity-100 ' 
          />)
      })
    }

    return (content)
  }

  return (
    <div className='m-0 p-0 text-center w-[100%] bg-slate-200'>
      <div className=' flex flex-wrap justify-center items-center gap-3'>
        {loadContent()}
      </div>
    </div>
  )
}

export default App
