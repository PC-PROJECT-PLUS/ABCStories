import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, OnInit, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookSlider } from '../book-slider/book-slider';

@Component({
  selector: 'app-home',
  imports: [Navbar, BookSlider],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home implements AfterViewInit, OnDestroy {
  private slides: NodeListOf<HTMLElement> = {} as NodeListOf<HTMLElement>;
  private prevBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private dotsContainer: HTMLDivElement | null = null;
  private ambientBg: HTMLDivElement | null = null;
  private dots: HTMLElement[] = [];

  public slidesCount: number = 0;
  public current = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private readonly autoplayDelay = 7000;

  //cardWidth = 204.2;
  //currentIndex = 0;

  booksA = [
    { title: 'Il Nome della Rosa', author: 'U. Eco', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&q=80', liked: false, bookmarked: false },
    { title: "L'Alchimista", author: 'P. Coelho', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Cime Tempestose', author: 'E. Brontë', img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Orgoglio e Pregiudizio', author: 'J. Austen', img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Il Grande Gatsby', author: 'F.S. Fitzgerald', img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Delitto e Castigo', author: 'F. Dostoevskij', img: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Don Chisciotte', author: 'M. de Cervantes', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Anna Karenina', author: 'L. Tolstoy', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Anna Karenina', author: 'L. Tolstoy', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=320&q=80', liked: false, bookmarked: false },
  ];

  booksB = [
  { title: 'Cento anni di solitudine', author: 'G.G. Márquez', img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=320&q=80', liked: false, bookmarked: false },
  { title: 'La Metamorfosi', author: 'F. Kafka', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=320&q=80', liked: false, bookmarked: false },
  { title: 'Il Processo', author: 'F. Kafka', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=320&q=80', liked: false, bookmarked: false },
  { title: 'Lolita', author: 'V. Nabokov', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=320&q=80', liked: false, bookmarked: false },
  { title: 'Il Signore degli Anelli', author: 'J.R.R. Tolkien', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&q=80', liked: false, bookmarked: false },
  { title: '1984', author: 'G. Orwell', img: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=320&q=80', liked: false, bookmarked: false },
  { title: 'Il Vecchio e il Mare', author: 'E. Hemingway', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=320&q=80', liked: false, bookmarked: false },
  { title: 'Siddharta', author: 'H. Hesse', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=320&q=80', liked: false, bookmarked: false },
  { title: 'Il Conte di Montecristo', author: 'A. Dumas', img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=320&q=80', liked: false, bookmarked: false },
  { title: 'Le avventure di Sherlock Holmes', author: 'A.C. Doyle', img: 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=320&q=80', liked: false, bookmarked: false },
];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);

      setTimeout(() => {
        this.initSlider();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }


  private initSlider(): void {
    this.slides = document.querySelectorAll<HTMLElement>('.slide');
    this.slidesCount = this.slides.length;
    this.prevBtn = document.querySelector<HTMLButtonElement>('.prev');
    this.nextBtn = document.querySelector<HTMLButtonElement>('.next');
    this.ambientBg = document.querySelector<HTMLDivElement>('.ambient-bg');

    this.addEventListeners();
    this.updateSlides();
    this.startAutoSlide();
    this.cdr.detectChanges();
  }

  private addEventListeners(): void {
    this.nextBtn?.addEventListener('click', () => {
      this.nextSlide();
      this.restartAutoSlide();
    });

    this.prevBtn?.addEventListener('click', () => {
      this.prevSlide();
      this.restartAutoSlide();
    });

    const slider = document.querySelector<HTMLElement>('.hero-slider');

    if (slider) {
      slider.addEventListener('mouseenter', () => this.stopAutoSlide());
      slider.addEventListener('mouseleave', () => this.startAutoSlide());
    }
  }

  private updateSlides(): void {
    const total = this.slidesCount;
    if (total === 0) return;

    this.slides.forEach((slide: HTMLElement, index: number) => {
      slide.classList.remove('active', 'prev-slide', 'next-slide');
      if (index === this.current) {
        slide.classList.add('active');
      } else if (index === (this.current - 1 + total) % total) {
        slide.classList.add('prev-slide');
      } else if (index === (this.current + 1) % total) {
        slide.classList.add('next-slide');
      }
    });

    this.updateAmbientBackground();
    this.cdr.detectChanges();
  }

  private updateAmbientBackground(): void {
    if (!this.ambientBg || !this.slides[this.current]) return;

    const bgImage = this.slides[this.current].dataset['bg'];
    if (!bgImage) return;

    this.ambientBg.style.opacity = '0';

    setTimeout(() => {
      if (this.ambientBg) {
        this.ambientBg.style.backgroundImage = `url('${bgImage}')`;
        this.ambientBg.style.opacity = '0.95';
      }
    }, 180);
  }

  public goToSlide(index: number): void {
    this.current = index;
    this.updateSlides();
  }

  private nextSlide(): void {
    this.current = (this.current + 1) % this.slides.length;
    this.updateSlides();
  }

  private prevSlide(): void {
    this.current = (this.current - 1 + this.slides.length) % this.slides.length;
    this.updateSlides();
  }

  private startAutoSlide(): void {
    this.stopAutoSlide();

    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  private stopAutoSlide(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  public restartAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }


  /*toggleLike(book: any) {
    book.liked = !book.liked;
  }

  toggleBookmark(book: any) {
    book.bookmarked = !book.bookmarked;
  }

  get visible(): number {
    if (typeof window === 'undefined') return 4;
    return Math.floor(window.innerWidth / this.cardWidth);
  }

  get maxIndex(): number {
    const max = this.books.length - this.visible;
    return max > 0 ? max : 0;
  }

  onMouseWheel(event: WheelEvent) {
    if (Math.abs(event.deltaY) > 20 || Math.abs(event.deltaX) > 20) {
      event.preventDefault();
      if (event.deltaY > 0 || event.deltaX > 0) this.next();
      else this.prev();
    }
  }

  ngOnInit() { this.clamp(); }

  @HostListener('window:resize')
  onResize() {
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  private clamp() {
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.maxIndex));
  }*/
}
