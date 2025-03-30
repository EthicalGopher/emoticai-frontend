
import React from 'react';
import { Button } from "./ui/button";
import { MenubarMenu, MenubarTrigger } from "./ui/menubar";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">Chat App</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Button variant="ghost" className="w-9 px-0">
              <MenubarMenu>
                <MenubarTrigger>Menu</MenubarTrigger>
              </MenubarMenu>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
