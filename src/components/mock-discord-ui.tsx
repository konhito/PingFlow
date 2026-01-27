import React, { PropsWithChildren } from 'react'
import { Icons } from './icons'
import { Cog, Gift, Headphones, HelpCircle, Inbox, Menu, Mic, Phone, Pin, PlusCircle, Search, Smile, Sticker, UserCircle, Video } from 'lucide-react'
import Image from 'next/image'

export const MockDiscordUI = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-[800px] w-full max-w-[1200px] bg-discord-background text-white rounded-lg overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_#000] dark:border-white/20 dark:shadow-[8px_8px_0px_0px_#757373]">
      {/* server list */}
      <div className="hidden sm:flex w-[72px] bg-[#202225] py-3 flex-col items-center border-r-2 border-black dark:border-white/20">
        <div className="size-12 bg-discord-brand-color rounded-md border-2 border-black flex items-center justify-center mb-2 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]">
          <Icons.discord className="size-3/5 text-white" />
        </div>

        <div className="w-8 h-[2px] bg-discord-background rounded-full my-2" />

        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="size-12 bg-discord-background rounded-md border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#000] transition-all duration-200 cursor-not-allowed dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]"
          >
            <span className="text-lg font-semibold text-gray-400">
              {String.fromCharCode(65 + i)}
            </span>
          </div>
        ))}

        <div className="group mt-auto size-12 bg-discord-background rounded-md border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#000] transition-all duration-200 cursor-not-allowed dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]">
          <PlusCircle className="text-[#3ba55c] group-hover:text-white" />
        </div>
      </div>

      {/* dm list */}
      <div className="hidden md:flex w-65 bg-[#2f3136] flex-col border-r-2 border-black dark:border-white/20">
        <div className="px-4 h-16 border-b-2 border-black flex items-center dark:border-white/20">
          <div className="w-full bg-[#202225] text-sm rounded-md border-2 border-black px-2 h-8 flex items-center justify-center text-gray-500 cursor-not-allowed shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]">
            Find or start a conversation
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <div className="px-2 mb-4">
            <div className="flex items-center text-sm px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <UserCircle className="mr-4 size-8 text-[#b9bbbe]" />
              <span className="font-medium text-sm">Friends</span>
            </div>

            <div className="flex items-center text-sm px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <Inbox className="mr-4 size-8 text-[#b9bbbe]" />
              <span className="font-medium text-sm">Nitro</span>
            </div>
          </div>

          <div className='px-2 mb-4'>
            <h3 className='text-xs font-semibold text-[#8e9297] px-2 mb-2 uppercase'>
              Direct Message
            </h3>

            <div className='flex items-center px-2 py-1.5 rounded-md border-2 border-black bg-[#393c43] text-white cursor-pointer shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]'>
              <Image
                src="/brand-asset-profile-picture.png"
                alt='PingFlow Avatar'
                width={32}
                height={32}
                className='object-cover rounded-md border-2 border-black mr-3 dark:border-white/20'
              />
              <span className='font-medium font-excon'>PingFlow</span>
            </div>

            <div className='my-1 space-y-px'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='flex items-center px-2 py-1.5 rounded text-gray-600 cursor-not-allowed'
                >
                  <div className='size-8 rounded-full bg-discord-background mr-3' />
                  <span className='font-medium'>User {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='p-2 bg-[#292b2f] flex items-center border-t-2 border-black dark:border-white/20'>
          <div className='size-8 rounded-md border-2 border-black bg-brand-700 mr-2 dark:border-white/20' />
          <div className='flex-1'>
            <p className='text-sm font-medium text-white font-excon'>You</p>
            <p className='text-xs text-[#b9bbbe] flex items-center font-satoshi'>@your_account</p>
          </div>

          <div className='flex items-center space-x-2'>
            <Mic className='size-5 text-[#b9bbbe] hover:text-white cursor-pointer' />
            <Headphones className='size-5 text-[#b9bbbe] hover:text-white cursor-pointer' />
            <Cog className='size-5 text-[#b9bbbe] hover:text-white cursor-pointer' />
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 flex flex-col">
        {/* dm header */}
        <div className="h-16 bg-[#36393f] flex items-center px-4 border-b-2 border-black dark:border-white/20">
          <div className="md:hidden mr-4">
            <Menu className="size-6 text-[#b9bbbe] hover:text-white cursor-pointer" />
          </div>

          <div className="flex items-center">
            <div className="relative">
              <Image
                src="/brand-asset-profile-picture.png"
                alt="PingFlow Avatar"
                width={40}
                height={40}
                className="object-cover rounded-md border-2 border-black mr-3 dark:border-white/20"
              />
              <div className="absolute bottom-0 right-3 size-3 bg-green-500 rounded-md border-2 border-[#36393f]" />
            </div>

            <p className="font-semibold text-white font-excon">PingFlow</p>
          </div>

          <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
            <Phone className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <Video className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <Pin className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <UserCircle className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <Search className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <Inbox className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <HelpCircle className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
          </div>
        </div >

        {/* message history */}
        <div className='flex-1 overflow-y-auto p-4 bg-discord-background flex flex-col-reverse'>
          {children}
        </div>

        {/* messgae input */}
        <div className='p-4'>
          <div className='flex items-center bg-[#40444b] rounded-md border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]'>
            <PlusCircle className='mx-3 text-[#b9bbbe] hover:text-white cursor-not-allowed' />
            <input
              readOnly
              type='text'
              placeholder='Message @PingFlow'
              className='flex-1 bg-transparent py-2.5 px-1 text-white placeholder-[#72767d] focus:outline-none cursor-not-allowed font-satoshi'
            />
            <div className='flex items-center space-x-3 mx-3 text-[#b9bbbe]'>
              <Gift className='size-5 hover:text-white cursor-not-allowed hidden sm:block' />
              <Sticker className='size-5 hover:text-white cursor-not-allowed hidden sm:block' />
              <Smile className='size-5 hover:text-white cursor-not-allowed hidden sm:block' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

