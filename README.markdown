jQuery plugin which wraps up the Windows 8 WinRT Media Capture API

# What...

Abstracts the WinRT capture API.. So we can write something like


	// initialise the device camera
	$("<video width='200px' height='200px'>").capture(function(){
	
		// Add the tag to the body.
		$(this).appendTo('body');
		
		// Add events to take pictures
		$(this).capture('snapshot', function(){
			// e.blob
			// insert the blob as the src of an image or save
		});
	});


# Why

To do this with the WinRT has crazy convoluted namespaces on everything
And i'm all for a single code base so you could manipulate this to work with the fourthcoming W3C Capture API


# Support & Licsence

Please use freely and help us develop this.