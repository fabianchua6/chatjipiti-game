import {test,expect} from '@playwright/test';
test('new game registers, starts, restarts and preserves the library',async({page,isMobile})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#games');
 for(const name of ['You’re Absolutely Right!','Make No Mistakes','Draw Me a Yellow Circle']) await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
 await page.goto('/#'+process.env.GAME_SLUG);
 const game=page.getByTestId('studio-game');await expect(game).toBeVisible();
 await expect(game.getByRole('heading').first()).toBeVisible();
 const start=game.getByRole('button',{name:'Start game',exact:true});
 if(isMobile)await start.tap();else{await start.focus();await page.keyboard.press('Enter');}
 await expect(start).not.toBeVisible();
 await expect(game.getByRole('button',{name:'Restart game',exact:true})).toBeVisible();
 await page.keyboard.press('ArrowRight');await page.keyboard.press('Space');
 const restart=game.getByRole('button',{name:'Restart game',exact:true});if(isMobile)await restart.tap();else{await restart.focus();await page.keyboard.press('Enter');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
 await page.getByRole('button',{name:'All games',exact:true}).click();
 await expect(page.getByRole('heading',{name:'ChatJiPiTi Game',exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});
