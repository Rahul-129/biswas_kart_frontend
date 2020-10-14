import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { ProductModelServer } from 'src/app/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'
import { CartService } from './../../services/cart.service';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  id: number;
  product: ProductModelServer;
  thumbImages: any[] = [];

  @ViewChild('quantity') quantityInput: ElementRef;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private toast: ToastrService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(
        (param: ParamMap) => {
          //@ts-ignore
          return param.params.id;
        }
      )
    ).subscribe(prodId => {
      this.id = prodId;
      this.productService.getSingleProduct(this.id).subscribe(prod => {
        this.product = prod;
        if (prod.images !== null) {
          this.thumbImages = prod.images.split(';');
        }
      });
    });
  }

  ngAfterViewInit(): void {
    // Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	// Product img zoom
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
		$('#product-main-img .product-preview').zoom();
	}  
}

  addToCart(id: number) {
    this.cartService.addProductToCart(id, this.quantityInput.nativeElement.value);
  }

  increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity >= 1) {
      value++;
      if (value > this.product.quantity) {
        value = this.product.quantity;
        this.toast.error("No more In Stock", "No Stock", {
          timeOut: 1500,
              progressBar: true,
              progressAnimation: "increasing",
              positionClass: "toast-bottom-center"
        });
      }
    } else {
      return;
    }
    this.quantityInput.nativeElement.value = value.toString();
  }

  decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity > 0) {
      value--;
      if (value <= 1) {
        value = 1;
      }
    } else {
      return;
    }
    this.quantityInput.nativeElement.value = value.toString();
  } 
}
