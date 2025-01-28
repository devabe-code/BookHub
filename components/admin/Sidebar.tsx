"use client"

import React from 'react'
import Image from 'next/image';
import { adminSideBarLinks } from '@/constants';
import { cn, getInitials } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Session } from 'next-auth';

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <div className="admin-sidebar">
        <div>
            <div className="logo">
                <Image src="/icons/admin/logo.svg" alt="Logo" width={37} height={37} />
                <h1>BookWise</h1>
            </div>

            <div className="mt-10 flex flex-col gap-5">
                {adminSideBarLinks.map((link) => {
                    const isSelected = (link.route != '/admin' && 
                                        pathname.includes(link.route) && 
                                        link.route.length > 1) ||
                                        pathname === link.route;

                    return (
                        <Link href={link.route} key={link.route}>
                        <div
                          className={cn(
                            "link",
                            isSelected && "bg-primary-admin shadow-sm",
                          )}
                        >
                          <div className="relative size-5">
                            <Image
                              src={link.img}
                              alt="icon"
                              fill
                              className={`${isSelected ? "brightness-0 invert" : ""}  object-contain`}
                            />
                          </div>
        
                          <p className={cn(isSelected ? "text-white" : "text-dark")}>
                            {link.text}
                          </p>
                        </div>
                      </Link>
                    )
                })}
            </div>
        </div>

        <div className="user">
            <Avatar>
                <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback className="text-white bg-amber-500">
                        {getInitials(session?.user?.name || '')}
                    </AvatarFallback>
            </Avatar>

            <div className="flex flex-col max-md:hidden">
                <p className='text-sm font-bold'>{session?.user?.name}</p>
                <p className='text-xs text-muted-foreground'>{session?.user?.email}</p>
            </div>
        </div>
    </div>
  )
}

export default Sidebar