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


This plugin has basic commands


	// initialise a webcam stream
	$(video).capture(function(){})

	// take a picture of the stream
	$(video).capture("snapshot", function(){})

	// start a recording of the stream
	$(video).capture("record", function(e){})

	// stop a recording of the stream
	$(video).capture("stoprecording", function(e){})

	// current state of the recording
	$(video).capture("recording", function(e){})
	

The first argument passed back to the callback function is an object containing links to the video and or image

	{
		blob : blob_uri, // browser blob uri. Use this to display in the "src" attribute of the <video> or <img> tags respectively. 
		path : filesystem // path on the filesystem where the temporary file is stored
	}


# Why

To do this with the WinRT has crazy convoluted namespaces on everything
And i'm all for a single code base so you could manipulate this to work with the fourthcoming W3C Capture API


# Support & Licsence

Please use freely and help us develop this.