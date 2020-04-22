namespace $.$$ {
	
	export class $hyoo_slides_page extends $.$hyoo_slides_page {
		
		listener_width() {
			if( this.role() === 'listener' ) return Number.POSITIVE_INFINITY
			return super.listener_width()
		}

		uri_page() {
			return this.uri_base() + `#slide=${ this.slide() }`
		}
		
	}
	
}
