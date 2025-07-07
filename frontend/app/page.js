import React from 'react'
import Link from 'next/link'
function page() {
  return (
    <div><button>
      <Link href="/auth" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200">
      Login/Signup
      </Link>
      </button></div>
  )
}

export default page