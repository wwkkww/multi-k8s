import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function OtherPage() {
  return (
    <div>
      Other page!
      <Link to="/">Go back home</Link>
    </div>
  )
}

export default OtherPage
