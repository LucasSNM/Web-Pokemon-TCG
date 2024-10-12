import { useEffect, useState } from 'react'


function App() {

  const [Sets, setSets] = useState<any>([])
  const [CardsSet, setCardsSet] = useState<any>({ cards: [] })
  const [Card, setCard] = useState<any>({ name: '' })

  useEffect(() => {
    searchSets()
  }, [])

  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [position, setPosition] = useState({ x: 600, y: 0 }); // Track position

  // Called when mouse button is pressed
  const handleMouseDown = () => {
    setIsDragging(true); // Enable dragging
  };

  // Called when mouse button is released
  const handleMouseUp = () => {
    setIsDragging(false); // Disable dragging
    setPosition({x: 600, y: 0})
  };

  // Called when mouse moves
  const handleMouseMove = (e: any) => {
    if (isDragging) {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
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

  useEffect(() => {
    console.log(position)
    // console.log(CardsSet.cards)
  }, [position])

  const loadContent = () => {

    let content: any = []

    const style = {
      perspective: '200px',
      transition: "all .2s ease-out",
      backgroundImage: `url(${Card.image + '/high.png'})`,
      transform: `matrix3d(1, 0, 1, ${(position.x-600)/1000000}, 0, 1, 0, 0, -0.34, 0, 0.94, 0, 1, 0, 10, 1) translateX(-10px)`,
      height: `${3.5*12}rem`,
      width: `${2.55*12}rem`,
      backgroundSize: 'cover',
      boxShadow: '0px 10px 50px rgba(0,0,0,0.8)',
      zindex: 1,
      cursor: isDragging ? 'grabbing' : 'grab',
    };

    if (Card.name !== '') {
      // Card.map((x: any, index: number) => {
      content.push
        (<div key={'cards-' + Card.id} className='flex justify-center items-center flex-col h-[100vh] w-[100vw]'
          onMouseDown={handleMouseDown}  // Start dragging
          onMouseMove={handleMouseMove}  // Track mouse movement
          onMouseUp={handleMouseUp}      // Stop dragging
          onMouseLeave={handleMouseUp}   // Stop dragging if mouse leaves the area
        >
          <div
            style={style}
          >
          </div>
        </div>)
      // })
    }
    else if (CardsSet.cards.length > 0) {
      CardsSet.cards.map((x: any, index: number) => {
        content.push
          (<div key={'cards-' + x.id} className='justify-evenly flex-grow h-full w-1/6'>
            <button className='shadow-sm' key={'btn-' + x.id} onClick={() => searchCard(x.id)}>
              {
                x.image != null
                  ? <img
                    src={x.image + '/low.png'}
                    alt={x.logo}
                    className='backdrop-brightness-50 backdrop-contrast-0 transition-all'
                  />
                  : <p className='text-wrap'>{x.name}</p>
              }
            </button>
          </div>)
      })
    }
    else {
      Sets.map((x: any, index: number) => {
        content.push
          (<div key={'set-' + index} className='justify-evenly flex-grow h-full w-1/6'>
            <button className='shadow-sm' key={'btn-' + x.id} onClick={() => searchCardsSet(x.id)}>
              {
                x.logo != null
                  ? <img src={x.logo + '.png'} alt={x.logo} />
                  : <p className='text-wrap'>{x.name}</p>
              }
            </button>
          </div>)
      })
    }

    return (content)
  }

  return (
    <div className='mx-auto px-4 text-center w-[100%] bg-slate-200'>
      <div className=' flex flex-wrap justify-center items-center gap-3'>
        {loadContent()}
      </div>
    </div>
  )
}

export default App
