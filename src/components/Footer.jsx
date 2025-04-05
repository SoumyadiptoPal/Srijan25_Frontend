function Footer() {
  return (
    <footer className='grid grid-cols-7 sm:grid-cols-5 border-t border-t-greyBorder w-full'>
      <div></div>
      <div className='col-span-5 sm:col-span-3 border-l border-r border-l-greyBorder border-r-greyBorder flex flex-col gap-y-8 sm:gap-y-2 p-1 sm:p-3'>
        <div className='flex flex-col sm:flex-row justify-between p-2 sm:p-8'>
          <div className='flex flex-col items-center sm:items-start gap-y-4'>
            <h2 className='text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white to-light-pink'>Explore</h2>
            <div className='flex flex-col text-center sm:text-left sm:text-lg underline underline-offset-2'>
              <a href='/'>Home</a>
              <a href='/events'>Events</a>
              <a href='/merchandise'>Merchandise</a>
              <a href='https://docs.google.com/forms/d/e/1FAIpQLSe-zoCeE50FR2dUzauh7wfvHxfHczPwgziqYhRju2zMLH164A/viewform'>Ambassador</a>
              <a href='/accommodation'>Accommodation</a>
            </div>
          </div>
          <div className='flex flex-col gap-y-4 items-center sm:items-end'>
            <h2 className='text-3xl text-transparent bg-clip-text bg-gradient-to-t from-white to-light-pink mt-4 sm:mt-0'>Legal</h2>
            <div className='flex flex-col text-center sm:text-right underline underline-offset-2 sm:text-lg'>
              <a href='/docs/Srijan_Privacy_Policy.pdf'>Privacy</a>
              <a href='/docs/Srijan_Terms_and_Conditions.pdf'>Terms</a>
              <a href='/docs/Srijan_Events_Brochure.pdf'>Events</a>
            </div>
          </div>
        </div>
        <div>
          <p className='text-center text-sm pb-2 sm:pb-0'>&copy; 2025 - F.E.T.S.U. Presents Srijan, Jadavpur University, Kolkata. All rights reserved.</p>
        </div>
      </div>
      <div></div>
    </footer>
  )
}

export default Footer
