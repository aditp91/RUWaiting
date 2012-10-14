$(begin());

function begin()
{
	var mycoords;
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position)
		{
	  	var lat = position.coords.latitude;
	    var lng = position.coords.longitude;
			
			$.ajax('nearby/?lat='+lat+'&lon='+lng, {
				success: function(data, status, xhr) {
					console.log(data);
					//data = ['College Hall', 'Scott Hall', 'Trayes Hall'];
					for (i=0;i<data.length;i++){
					   $('<option/>').val(data[i]).html(data[i]).appendTo('#stop');
					}				
				}
			});
			
			$('#stop').change(function(e) {
				$.ajax('buses/?stop='+$('#stop').val(), {
					success: function(data, status, xhr) {
						console.log(data);		
						//data = [{title: 'EE', seconds: '100'}, {title: 'A', seconds: '340'}];
						for (i=0;i<data.length;i++){
						   $('<option/>').val(data[i].seconds).html(data[i].title).appendTo('#bus');
						}
					}
				});
			});
			
		}, function(err) {
			if (err.code == 1)
				console.log("Geolocation needs to be enabled.")
		});
	} else {
		console.log("Geolocation not supported.");
	}
	return false;
}