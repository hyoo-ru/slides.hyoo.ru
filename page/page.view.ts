namespace $.$$ {
	
	export class $hyoo_slides_page extends $.$hyoo_slides_page {
		
		sub() {
			const role = this.role()
			return [
				this.Listener() ,
				... ( role === 'listener' ) ? [] : [ this.Speaker() ] ,
			]
		}
		
	}
	
}
