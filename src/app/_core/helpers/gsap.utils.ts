import { ElementRef } from '@angular/core';
import gsap from 'gsap';

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any*/
export default class GsapUtils {
    static animationDictionary: {[key: string]: (arg: any) => void} = {
        ['riseUp']: this.riseUp,
        ['riseDown']: this.riseDown,
      };

      public static topBarAnimation(navbarRef: ElementRef, apptextRef: ElementRef, righttextRef: ElementRef){
        const timeline = gsap.timeline();
        timeline.set(navbarRef?.nativeElement, {opacity: 0, yPercent: -100});
        timeline.set(apptextRef?.nativeElement, {opacity: 0, xPercent: -100});
        timeline.set(righttextRef?.nativeElement, {opacity: 0, xPercent: 100});
        timeline.to(navbarRef?.nativeElement, {duration: 0.5, opacity: 1, yPercent: 0});
        timeline.to(apptextRef?.nativeElement, {duration: 0.5, opacity: 1, xPercent: 0});
        timeline.to(righttextRef?.nativeElement, {duration: 0.5, opacity: 1, xPercent: 0}, "<");
      }

      public static homePageAnimation(h1Ref: ElementRef, pRef: ElementRef){
        const timeline = gsap.timeline();
        timeline.set(".right", {opacity: 0, scale: 0.9, xPercent: 100});
        timeline.set(".left", {opacity: 0, scale: 0.9, xPercent: -100});
        timeline.set(h1Ref?.nativeElement, {opacity: 0, xPercent: -100});
        timeline.set(pRef?.nativeElement, {opacity: 0, xPercent: 100});
        timeline.to(".card", {
          duration: 0.75,
          opacity: 1,
          scale: 0.9,
          xPercent: 0,
          ease: "back.in",
          stagger: {
            amount: 0.5,
            repeatDelay: 0.2,
            grid: [1,6],
            axis: "x",
            ease: "power3.inOut",
            from: "center"
            }
          }
        );
        timeline.to(h1Ref?.nativeElement, {duration: 0.25, opacity: 1, xPercent: 0});
        timeline.to(pRef?.nativeElement, {duration: 0.25, opacity: 1, xPercent: 0}, "<");
      }

      private static riseUp(event: any){
        gsap.to(event.target, {yPercent:-3,duration: 0.25, filter: "brightness(0.5) grayscale(0.5) saturate(0.5) contrast(0.5)"});
      }

      private static riseDown(event: any){
        gsap.to(event.target, {yPercent:0,duration: 0.25, filter: "brightness(1) grayscale(0) saturate(1) contrast(1)"});
      }
}
