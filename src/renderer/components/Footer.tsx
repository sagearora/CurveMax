import React from 'react'
import packageJson from '../../../package.json'

function Footer({
    base_url,
    token,
}: {
    base_url: string
    token: string
}) {
    return (
        <section className="bg-slate-100 py-4">
            <div className='container'>
                <p className="text-base text-center mb-4">
                    © {new Date().getFullYear()} Arora Dental. All rights reserved.
                </p>
                <div className='flex container text-gray-400 items-center'>
                    <p className='flex-1'>{base_url}</p>
                    <p className='flex-1'>{token}</p>
                    <p className='text-sm '>
                        Version: {packageJson.version}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Footer