import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { LocaleService } from '../../../endpoints/locale-endpoints/locale.service';
import { TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import * as Routing from 'leaflet-routing-machine';
import {LocaleImageGetRequest, LocaleImagePostRequest, LocaleImageService} from '../../../endpoints/locale-image-endpoints/locale-image-endpoint';
import { trigger, transition, style, animate, state } from '@angular/animations';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {ReactionService} from '../../../endpoints/reactions-controller/reactions-controller';
import {FavouriteService} from '../../../endpoints/favourites-controller/favourites-controller';
import {ReviewEndpointsService, ReviewDeleteRequest, ReviewRatingCountsResponse, ReviewUpdateRequest, ReviewPostRequest, ReviewGetBySortResponse} from '../../../endpoints/reviews-endpoints/reviews-endpoints';
import {LocaleDetails} from '../../../endpoints/locale-endpoints/locale.service';
import {TableService} from '../../../endpoints/tables-endpoint/tables-endpoints';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-load-locale',
  templateUrl: './load-locale.component.html',
  styleUrls: ['./load-locale.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // kada se element pojavi/nestane
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('250ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'scale(0.8)', opacity: 0 }))
      ])
    ])
  ]
})

export class LoadLocaleComponent implements OnInit {
  localeId!: number;
  localeDetails!: LocaleDetails;
  isLoading = true;
  zoomLevel: number = 1;
  zoomStyle: string = 'scale(1)';
  isModalOpen: boolean = false;
  newReview: string = '';
  rating: number = 0;
  reviews: ReviewGetBySortResponse[] = [];
  averageRating: number = 0;
  previewImage: string | null = null;
  showDeleteConfirmation: boolean = false;
  deleteReviewId!: number;
  protected readonly Math = Math;
  currentLang: string;
  private map: L.Map | undefined;
  private markers: L.Marker[] = [];
  private routingControl: L.Routing.Control | undefined;
  imageGallery:{ id: number; url: string }[] = [];
  isImageModalOpen: boolean = false;
  selectedImage:{ id: number; url: string } | null = null;
  getRequest: LocaleImageGetRequest | undefined ;
  postRequest: LocaleImagePostRequest| undefined;
  isFullGalleryModalOpen: boolean = false;
  currentZoom: number = 1;
  isZoomed: boolean = false;
  currentImageIndex: number = 0;
  isAddModalOpen: boolean = false;
  user:any;
  isFavourited: boolean = false;
  currentPage: number = 1;
  pageSize: number = 5;
  totalReviews: number = 0;
  hasUserReviewed: boolean = false;
  isOwner: boolean =false;
  ratingCounts: ReviewRatingCountsResponse | null = null;
  ratingCategories = [
    { label: 'Excellent', key: 'excellent', color: '#4caf50' },
    { label: 'Good', key: 'good', color: '#8bc34a' },
    { label: 'Average', key: 'average', color: '#ffc107' },
    { label: 'Poor', key: 'poor', color: '#ff9800' },
    { label: 'Terrible', key: 'terrible', color: '#f44336' },
  ];
  selectedSort: string = 'mostLikes'; // Defaultna vrijednost




  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private localeService: LocaleService,
    private translate: TranslateService,
    private localeImageServis:LocaleImageService,
    public myAuthService:MyAuthService,
    private reactionService:ReactionService,
    private favouriteService:FavouriteService,
    private reviewService: ReviewEndpointsService,
    private tableService: TableService,
    private toastr: ToastrService
  ) {

    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);


  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.localeId = +params['id'];


      this.tableService.checkIfOwner2(this.localeId).subscribe((isOwner: boolean) => {
        this.isOwner = isOwner;

        if (this.isOwner) {
          console.log("✅ Vlasnik");
        } else {
          console.log("❌ Nije vlasnik");
        }
      });




      this.user=this.myAuthService.getMyAuthInfo();


      this.getRequest = { localeId: this.localeId };
      this.postRequest = { localeId: this.localeId, imageBase64: '' };

      this.fetchLocaleDetails();
      this.fetchReviews();
      this.fetchGalleryImages();
      this.checkIfFavourited();


    });

    this.translate.setDefaultLang('en');
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      this.translate.use(storedLang);
    }


  }


//Reviews
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.zoomLevel = 1;
    this.zoomStyle = 'scale(1)';
  }

  formatTime(time: { hour: number; minute: number }): string {
    const hour = time.hour.toString().padStart(2, '0');
    const minute = time.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }

  fetchLocaleDetails(): void {
    this.localeService.getLocaleDetailsById(this.localeId).subscribe(
      (data) => {
        if (typeof data.startOfWorkingHours === 'object') {
          data.startOfWorkingHours = this.formatTime(data.startOfWorkingHours as {
            hour: number;
            minute: number;
          });
        }
        if (typeof data.endOfWorkingHours === 'object') {
          data.endOfWorkingHours = this.formatTime(data.endOfWorkingHours as {
            hour: number;
            minute: number;
          });
        }

        this.localeDetails = data;
        this.isLoading = false;

        if (!this.localeDetails.latitude || !this.localeDetails.longitude) {
          this.getCoordinatesFromAddress(this.localeDetails.address)
            .then((coords) => {
              this.localeDetails!.latitude = coords.latitude;
              this.localeDetails!.longitude = coords.longitude;

              this.initializeMap();
            })
            .catch((error) => {
              console.error('Error fetching coordinates from address:', error);
            });
        } else {
          this.initializeMap();
        }
      },
      (error) => {
        console.error('Error fetching locale details:', error);
        this.isLoading = false;
      }
    );
  }

  onSortChange() {
    this.currentPage = 1;
    this.fetchReviews();
  }

  fetchReviews(): void {
    const request = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      localeId: this.localeId,
      sortBy: this.selectedSort
    };

    this.reviewService.getSorted(request).subscribe(
      (data) => {
        this.reviews = data.dataItems;
        this.totalReviews = data.totalCount;

        this.fetchAverageRating();
        this.fetchRatingCount();

        const userReview = this.reviews.find(r => r.user.id === this.user.personID);
        this.hasUserReviewed = !!userReview;

        this.reviews.forEach((review) => {
          this.reactionService.getReactionCounts(review.id).subscribe((counts) => {
            review.likeCount = counts.likes;
            review.dislikeCount = counts.dislikes;
          });
        });
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  fetchRatingCount(){
    this.reviewService.getRatingCounts(this.localeId).subscribe(res => {
      this.ratingCounts = res;
    });
  }

  fetchAverageRating(): void {
    this.reviewService.getAverage(this.localeId).subscribe(
      (response) => {
        this.averageRating = response.averageRating;
      },
      (error) => {
        console.error('Error fetching average rating:', error);
        this.averageRating = 0;
      }
    );
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  navigateToUpdate(): void {
    if (this.localeId) {
      this.router.navigate(['/public/update-locale', this.localeId]);
    }
  }

  addReview(): void {
    /*if (!this.newReview.trim()) {
      alert("You must add a description");
      return;
    }

    if (this.rating < 1 || this.rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }*/

    const token = localStorage.getItem('my-auth-token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.UserID;

      const reviewData: ReviewPostRequest = {
        description: this.newReview.trim(),
        rating: this.rating,
        localeId: this.localeId,
        userId: userId,
      };

      this.reviewService.postReview(reviewData).subscribe(
        () => {
          this.fetchReviews();
          this.newReview = '';
          this.rating = 0;
        },
        (error) => {
          console.error('Error adding review:', error);
          this.toastr.error(error.error);
          //alert(error.error); // prikaži backend grešku
        }
      );
    }
  }

  startEdit(review: ReviewGetBySortResponse): void {
    const token = localStorage.getItem('my-auth-token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.UserID;

      if (review.user.id != userId) {
        return;
      }

      review.isEditing = true;
      review.tempDescription = review.description;
      review.tempRating = review.rating;
    }
  }

  setTempRating(review: ReviewGetBySortResponse, rating: number): void {
    review.tempRating = rating;
  }

  cancelEdit(review: ReviewGetBySortResponse): void {
    review.isEditing = false;
    review.tempDescription = undefined;
    review.tempRating = undefined;
  }

  saveReview(review: ReviewGetBySortResponse): void {
    const token = localStorage.getItem('my-auth-token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.UserID;

      const updatedReview: ReviewUpdateRequest = {
        id: review.id,
        description: review.tempDescription!,
        rating: review.tempRating!,
        userId: userId,
      };

      this.reviewService.updateReview(updatedReview).subscribe(
        () => {
          review.description = review.tempDescription!;
          review.rating = review.tempRating!;
          review.isEditing = false;
          this.fetchReviews();
        },
        (error) => {
          console.error('Error updating review:', error);
        }
      );
    }
  }

  confirmDeleteReview(reviewId: number): void {
    const token = localStorage.getItem('my-auth-token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.UserID;

      const reviewToDelete = this.reviews.find(review => review.id === reviewId);

      if (reviewToDelete) {
        if (reviewToDelete.user.id == userId) {

          this.showDeleteConfirmation = true;
          this.deleteReviewId = reviewId;
        } else {

        }
      }
    }
  }

  deleteReviewConfirmed(): void {
    const token = localStorage.getItem('my-auth-token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.UserID;

      const deleteRequest: ReviewDeleteRequest = {
        reviewId: this.deleteReviewId,
        userId: userId
      };

      this.reviewService.deleteReview(deleteRequest).subscribe(
        () => {
          this.fetchReviews();
        },
        (error) => {
          console.error('Error deleting review:', error);
        }
      );
      this.showDeleteConfirmation = false;
    }
  }

  closeMessageBox(): void {
    this.showDeleteConfirmation = false;
  }

  deleteLocale() : void {
    if(this.localeId){
      if(confirm("Are you sure you want to delete this locale?")){
        this.localeService.deleteLocale(this.localeId).subscribe(
          ()=> {
            alert("Locale deleted successfully.");
            this.router.navigate(['/locales]']);
          },
          (error) => {
            console.error('Error while deleting locale');
            alert("An error occured while deleting locale");
          }
        );
      }
    }
  }

  changeLanguage(event: any): void {
    const selectedLang = event.target.value;
    this.translate.use(selectedLang);
    this.currentLang = selectedLang;
    localStorage.setItem('language', selectedLang);
  }

  reactToReview(review: ReviewGetBySortResponse, isLike: boolean): void {
    const userId: number = <number>this.myAuthService.getMyAuthInfo()?.personID;

    const existingReaction = review.userReaction;

    // Ako klikće istu reakciju koju je već dao -> ukloni
    if ((isLike && existingReaction === 'like') || (!isLike && existingReaction === 'dislike')) {
      this.reactionService.removeReaction(review.id, userId).subscribe({
        next: () => {
          review.userReaction = null;
          this.reviews.forEach((review) => {
            this.reactionService.getReactionCounts(review.id).subscribe((counts) => {
              review.likeCount = counts.likes;
              review.dislikeCount = counts.dislikes;
            });
          });
        },
        error: (err) => {
          console.error('Greška prilikom uklanjanja reakcije:', err);
        }
      });
    }
    // Inače, pošalji novu reakciju (ili menja postojeću)
    else {
      this.reactionService.reactToReview(review.id, userId, isLike).subscribe({
        next: () => {
          review.userReaction = isLike ? 'like' : 'dislike';
          this.reviews.forEach((review) => {
            this.reactionService.getReactionCounts(review.id).subscribe((counts) => {
              review.likeCount = counts.likes;
              review.dislikeCount = counts.dislikes;
            });
          });
        },
        error: (err) => {
          console.error('Greška prilikom dodavanja reakcije:', err);
        }
      });
    }
  }

  getBarWidth(key: string): number {
    if (!this.ratingCounts) return 0;

    const value = this.ratingCounts[key as keyof ReviewRatingCountsResponse];
    const total =
      this.ratingCounts.excellent +
      this.ratingCounts.good +
      this.ratingCounts.average +
      this.ratingCounts.poor +
      this.ratingCounts.terrible;

    if (!value || total === 0) return 0;

    return (value / total) * 100;
  }


//Galerija
  closeImageModal() {
    this.isImageModalOpen = false;
    this.isFullGalleryModalOpen=true;
    this.selectedImage = null;
    this.currentZoom = 1;
    this.isZoomed = false;
    this.zoomStyle = 'scale(1)';
  }

  fetchGalleryImages(): void {
    if (this.getRequest && this.getRequest.localeId) {
      this.localeImageServis.getImages(this.getRequest).subscribe(
        (data: any) => {
          if (data && data.images && data.imageIds) {
            this.imageGallery = data.images.map((img: string, index: number) => ({
              id: data.imageIds[index],
              url: `data:${data.contentType[index]};base64,${img}`
            }));
          } else {
            console.error('No images found in the response.');
          }
        },
        (error) => {
          console.error('Error fetching gallery images:', error);
        }
      );
    } else {
      console.error('getRequest is not properly initialized');
    }
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];

    if (file) {
      // Definišite maksimalnu veličinu slike (npr. 5 MB)
      const maxSize = 5 * 1024 * 1024; // 5MB u bajtovima

      // Proverite veličinu slike
      if (file.size > maxSize) {
        alert('Slika je prevelika! Maksimalna veličina slike je 5 MB.');
        return;
      }

      // Proverite tip slike (ako želite)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Nepodržan format slike! Podržani formati su JPG, PNG i GIF.');
        return;
      }

      // Ako je slika ispravna, prikažite je kao preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearPreview(): void {
    this.previewImage = null;
  }

  uploadImage(): void {
    if (this.postRequest && this.previewImage) {
      this.postRequest.imageBase64 = this.previewImage; // Postavi sliku za upload
      this.localeImageServis.addImage(this.postRequest).subscribe(
        (response:any) => {

          this.fetchGalleryImages();
          this.clearPreview(); // Očisti preview nakon uploada
          this.isAddModalOpen=false;
          this.toastr.success("Dodana nova fotografija !");
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }

  closeFullGalleryModal() {
    this.isFullGalleryModalOpen = false;
  }

  openFullGalleryModal(){
    this.isFullGalleryModalOpen = true;
  }

  zoomIn(): void {
    if (this.isZoomed) {
      this.currentZoom = 1;
      this.isZoomed = false;
    } else {
      this.currentZoom = 2;
      this.isZoomed = true;
    }
    this.zoomStyle = `scale(${this.currentZoom})`;
  }

  navigateToNextImage(): void {
    if (this.currentImageIndex < this.imageGallery.length - 1) {
      this.currentImageIndex++;
      this.selectedImage = this.imageGallery[this.currentImageIndex];
      this.currentZoom = 1;
      this.isZoomed = false;
      this.zoomStyle = 'scale(1)';
    }
  }

  navigateToPrevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.selectedImage = this.imageGallery[this.currentImageIndex];
      this.currentZoom = 1;
      this.isZoomed = false;
      this.zoomStyle = 'scale(1)';
    }
  }

  addToGallery(){
      this.isAddModalOpen=true;
  }

  closeAddModal(){
    this.isAddModalOpen=false;
  }

  openImageFromGallery(image: { id: number; url: string }, index: number): void {
    this.selectedImage = image;
    this.currentImageIndex = index;
    this.isImageModalOpen = true;
    this.isFullGalleryModalOpen=false;
    this.currentZoom = 1;
    this.isZoomed = false;
    this.zoomStyle = 'scale(1)';
  }

  deleteImageForLocale(): void {
    if (this.selectedImage?.id) {
      this.localeImageServis.deleteImage(this.selectedImage.id).subscribe({
        next: () => {
          console.log('✅ Slika obrisana');
          // ukloni iz liste bez refreša
          this.imageGallery = this.imageGallery.filter(img => img.id !== this.selectedImage?.id);
          this.closeImageModal();
          this.closeModal();
          this.closeAddModal();
          this.closeFullGalleryModal();
          this.fetchGalleryImages();
          this.toastr.info("Fotografija obrisana iz galerije !");
        },
        error: (err) => {
          console.error('❌ Greška prilikom brisanja slike', err);
        }
      });
    }
  }



  //Favoriti
  checkIfFavourited() {
    this.favouriteService.isFavourited(this.localeId).subscribe({
      next: (res) => (this.isFavourited = res),
      error: (err) => console.error('Greška prilikom provjere favorita:', err),
    });
  }

  toggleFavourite() {
    if (this.isFavourited) {
      this.favouriteService.removeFromFavourites(this.localeId).subscribe({
        next: () => {
          this.isFavourited = false;
          this.toastr.info('Uklonjen iz favorita');
          this.checkIfFavourited();
        },
        error: (err) => console.error('Greška prilikom uklanjanja iz favorita:', err),
      });
    } else {
      this.favouriteService.addToFavourites(this.localeId).subscribe({
        next: () => {
          this.isFavourited = true;
          this.toastr.success('Dodan u favorite');
          this.checkIfFavourited();
        },
        error: (err) => console.error('Greška prilikom dodavanja u favorite:', err),
      });
    }
  }

  //Lokacija
  getCoordinatesFromAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    return this.http.get<any[]>(url).toPromise().then(response => {

      if (response && response.length > 0) {
        return {
          latitude: parseFloat(response[0].lat),
          longitude: parseFloat(response[0].lon)
        };
      }
      throw new Error('Address not found');
    }).catch(error => {
      console.error('Error fetching coordinates:', error);
      throw error;
    });
  }

  showUserLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolokacija nije podržana u vašem pretraživaču.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;



        if (this.map) {
          const userMarker = L.marker([userLat, userLng], {
            icon: L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [0, -41],
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
              shadowSize: [41, 41],
              shadowAnchor: [12, 41],
            }),
            draggable: false,
          }).addTo(this.map).bindPopup('Vaša lokacija').openPopup();

          if (this.localeDetails) {
            const localeLat = this.localeDetails.latitude;
            const localeLng = this.localeDetails.longitude;

            if (this.routingControl) {
              this.map.removeControl(this.routingControl);
            }

            this.routingControl = L.Routing.control({
              routeWhileDragging: false,
              router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
              }),
              lineOptions: {
                styles: [{ color: 'blue', opacity: 0.7, weight: 5 }],
                extendToWaypoints: true,
                missingRouteTolerance: 0,
              },
              show: false, // Sakrij instrukcije
              fitSelectedRoutes: true,
              routeDragInterval: 0,
              plan: L.Routing.plan([
                L.latLng(userLat, userLng),
                L.latLng(localeLat, localeLng),
              ], {
                draggableWaypoints: false,
                addWaypoints: false,
                createMarker: (i, waypoint) => {
                  return L.marker(waypoint.latLng, {
                    draggable: false,
                    icon: L.icon({
                      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [0, -41],
                      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                      shadowSize: [41, 41],
                      shadowAnchor: [12, 41],
                    })
                  });
                }
              }),
            }).addTo(this.map);

            // Kada je routingControl inicijalizovan, sakrij instrukcije putem DOM manipulacije
            this.routingControl.on('routesfound', (event: any) => {
              if (event.routes && event.routes.length > 0) {
                const distance = event.routes[0].summary.totalDistance / 1000;
                const midPoint = this.calculateMidPoint(
                  L.latLng(userLat, userLng),
                  L.latLng(localeLat, localeLng)
                );

                L.popup()
                  .setLatLng(midPoint)
                  .setContent(`Udaljenost: ${distance.toFixed(2)} km`)
                  .openOn(this.map!);
              } else {
                console.error('No routes found');
              }

              // Sakrij uputstva direktno manipulacijom DOM-a
              const instructionsContainer = document.querySelector('.leaflet-routing-container');
              if (instructionsContainer) {
                (instructionsContainer as HTMLElement).style.display = 'none'; // Sakrij cijeli container sa uputama
              }
            });

            this.routingControl.on('routingerror', (event: any) => {
              console.error('Routing error:', event.error);
            });
          }
        }
      },
      (error) => {
        console.error('Greška pri dobijanju lokacije:', error);
        alert('Nije moguće dobiti vašu lokaciju.');
      }
    );
  }

  initializeMap(): void {

    if (this.localeDetails?.address) {
      this.getCoordinatesFromAddress(this.localeDetails.address).then((coords) => {


        this.map = L.map('map').setView([coords.latitude, coords.longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?nocache=true').addTo(this.map);

        const customIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -41],
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
        });

        // Dodaj marker za lokaciju lokala
        if (this.localeDetails?.name) {
          const mainMarker = L.marker([coords.latitude, coords.longitude], { icon: customIcon,draggable:false, })
            .addTo(this.map)
            .bindPopup(this.localeDetails.name)
            .openPopup();
          this.markers.push(mainMarker);
        }

        // Onemogući dodavanje markera na klik na mapu
        this.map.off('click'); // Ukloni event listener za klik na mapu
      }).catch(error => {
        console.error('Error getting coordinates:', error);
      });
    } else {
      console.error('Address not provided');
    }
  }

  calculateMidPoint(start: L.LatLng, end: L.LatLng): L.LatLng {
    return L.latLng(
      (start.lat + end.lat) / 2,
      (start.lng + end.lng) / 2
    );
  }

  //Rezervacija
  goToReservation(){
    this.router.navigateByUrl('/public/reservations/'+ this.localeId);
  }

}


