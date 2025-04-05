import "./cards.css"
import toast from "react-hot-toast";

const notify = () => toast("Coming soon!");

function Card({ card }) {
  const live = card.live;

  return <>
    {
      live ? <a href={card.link
      } className='flex relative flex-col items-center gap-y-2 w-[75vw] sm:w-full aspect-square h-auto cardContainer' >
        < div className='bg-gradient-to-b from-red via-lavender to-white p-0.5 overflow-hidden aspect-square h-full w-full cardDiv' >
          <div className='h-full w-full overflow-hidden'>
            <img src={card.image} alt={card.text} height="auto" width="auto" className='object-cover aspect-square h-full w-full bg-background p-2 transition-all duration-500 cardImage' />
          </div>
        </div >
        <div className='opacity-100 sm:opacity-0 transition-opacity duration-500 hover:opacity-100 absolute grid place-items-center bottom-[2px] left-1 sm:left-0.5 right-1 sm:right-0.5 bg-background/90 py-6 text-xl cardText'>
          <h2>{card.text}</h2>
        </div>
      </a >
        : <div onClick={notify} className='flex relative flex-col items-center gap-y-2 w-[75vw] sm:w-full h-auto cardContainer'>
          < div className='bg-gradient-to-b from-red via-lavender to-white p-0.5 overflow-hidden aspect-square h-full w-full cardDiv' >
            <div className='h-full w-full overflow-hidden'>
              <img src={card.image} alt={card.text} height="auto" width="auto" className='object-cover aspect-square h-full w-full bg-background p-2 transition-all duration-500 cardImage' />
            </div>
          </div >
          <div className='opacity-100 sm:opacity-0 transition-opacity duration-500 hover:opacity-100 absolute grid place-items-center bottom-[2px] left-1 sm:left-0.5 right-1 sm:right-0.5 bg-background/90 py-6 text-xl text-center cardText'>
            <h2>{card.text}</h2>
          </div>
        </div >
    }
  </>
}

function Cards() {

  const cardDetails = [
    {
      image: "/cards/events.png",
      text: "Events",
      link: "/events",
      live: true
    },
    {
      image: "/cards/workshop.jpg",
      text: "Workshop",
      link: "/workshop",
      live: true
    },
    {
      image: "/cards/campus-ambassadors.jpg",
      text: "Campus Ambassadors",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSe-zoCeE50FR2dUzauh7wfvHxfHczPwgziqYhRju2zMLH164A/viewform",
      live: true
    },
    {
      image: "/merchandise/tshirt2.png",
      text: "Merchandise",
      link: "/merchandise",
      live: true
    },
    {
      image: "/accommodation/dorm-photo.webp",
      text: "Accommodation",
      link: "/accommodation",
      live: true
    }
  ]

  return (
    <div className='min-h-[70vh] grid place-items-center w-full relative pb-8'>
      <div className='absolute w-5/7 sm:w-3/5 h-full border-greyBorder border-l border-r flex justify-center'>
        <div className='h-full w-[1px] mr-[2px] bg-greyBorder'></div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-5 place-items-center gap-6 z-50 sm:w-11/12'>
        {cardDetails.map((card, ind) => (
          <Card card={card} key={ind} />
        ))}
      </div>
    </div>
  )
}

export default Cards
