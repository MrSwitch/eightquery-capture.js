/**
 * New eightquery-capture
 * This is a Windows 8 WinRT wrapper for the capture and media API.
 *
 * @author Andrew Dodson < drew81.com >
 * @since Sept 2011
 *
 * Its pretty simple to use.
 *
 *
    // create a capture element for our camera(s)
    // here we use each to create new <video> elements for each camera... we could limit the resultset to one if we have a camera in mind.
    $('<video />').capture().each(function (){
        // you should then save the video's
        $(this).appendTo("#camera")... or something
    });

    // alternatively you can call record and listen to recording events
    $v.capture('record', function (e) {
        // e.blob
        // e.state
        // e.position
    });

    $v.capture('stoprecording', function (blob) { ... });
    $v.capture('snapshot', function (blob) { ... });

 */
(function ($) {


    // errors && log
    function errorHandler(e){ console.log("error"); console.log(e); }
    function log(e){ console.log(e); };

    // Global
    var devices = [],
        m = null,
        videoencoding = new Windows.Media.MediaProperties.MediaEncodingProfile.createMp4(Windows.Media.MediaProperties.VideoEncodingQuality.qvga),
        recording = false;


    /**
     * $(video).capture()
     * Add video capture to an video tag and let us record video and take a snap shot 
     *
     * @param action (optional values = "video" [default] | "record" | "stoprecording" | "snapshot" )
     * @param options (optional object),
     * @param vallback (optional function)
     */
    $.fn.capture = function (action, options, callback) {

        var self = this;

        if (typeof(action) !== "string") {
            callback = options;
            options = action;
            action = 'video';
        }
        if (typeof(options) !== "object") {
            callback = options;
            options = {};
        }

        // we already have a list of devices
        if (devices.length >= 0) {
            if (action === 'snapshot') {

                /// take a snapshot of the video.
                Windows.Storage.KnownFolders.picturesLibrary.createFileAsync("Capture_"+(new Date()).getTime()+".jpg").then(
                function (photoStorage) {
                    var photoProperties = new Windows.Media.MediaProperties.ImageEncodingProperties();
                    photoProperties.subtype = (options.type || "JPEG").toUpperCase();
                    photoProperties.width = options.width || 320;
                    photoProperties.height = options.width || 240;
                    m.capturePhotoToStorageFileAsync(photoProperties, photoStorage).then(
                    function (result) {
                        log("Photo Taken.  File " + photoStorage.path + "  ");
                        callback(photoStorage);
                    },
                    function (e) {
                        log("An exception occurred trying to capturePhoto: " + e.message);
                    });
                },
                function (e) {
                    log("capturePhoto async exception " + e.message);
                });
            }

            if (action === 'record') {
                Windows.Storage.KnownFolders.videosLibrary.createFileAsync("cameraCapture.mp4", Windows.Storage.CreationCollisionOption.generateUniqueName)
                .then(function (newFile) {
                    recording = newFile;
                    log("New file for recording " + recording.path);
                    m.startRecordToStorageFileAsync(videoencoding, newFile).then(function (result) {
                        log("Recording...");
                        callback(result);
                    }, errorHandler);
                }, errorHandler);
                log("Start recording...");
            }

            if (action === 'recording') {
                return recording;
            }

            if (action === 'stoprecording') {
                m.stopRecordAsync().then(function (result) {
                    callback(recording);
                    log(recording);
                    recording = false;
                }, errorHandler);
                log("Stopping...");
            }

            if (action !== 'video') {
                return this;
            }
        }

        log("Devices, searching");

        
        // Get the devices
        Windows.Devices.Enumeration.DeviceInformation.findAllAsync(Windows.Devices.Enumeration.DeviceClass.videoCapture)
        .then(function (r) {

            // Add the devices to deviceList
            devices = r;

            // if no devices then sheit
            if (devices.length === 0) {
                log("No camera device is found ");
                // disable buttons.
                return $(self);
            }
            log("Devices found "+devices.length);

            var $r = $(self),
                cln = $r.clone(true);


            // if: a document fragment?
            // duplicate the fragment for each of the devices we have
            if (self.length && !(self.get(0).parentNode&&self.get(0).parentNode.parentNode)) {
                log("Duplicating nodes for devices");
                for (var i = 1; i < devices.length; i++) {
                    log("New node");
                    $r = $r.add(cln);
                }
            }

            /*
            var c;

            // Get the device which corresponds to the video tags found
            c = new Windows.Media.Capture.MediaCaptureInitializationSettings();
            c.audioDeviceId = "";
            c.videoDeviceId = "";
            c.streamingCaptureMode = Windows.Media.Capture.StreamingCaptureMode.audioAndVideo;
            c.photoCaptureSource = Windows.Media.Capture.PhotoCaptureSource.videoStream;
            c.deviceExtensionEnabled = true;
            c.hardwareAccelerationEnabled = true;
            */

            // Loop through and initiate capture device
            $r.each(function(i){
                
                var video = this,
                        d = devices[i];

                function self() {

                    // release any video's
                    m = null;
                    $r.attr('src', null);
                    window.CollectGarbage();


                    $(video).attr('title', d.id);

                    //c.videoDeviceId = d.id;

                    m = new Windows.Media.Capture.MediaCapture();
                    m.addEventListener("failed", errorHandler, false);
                    //m.initializeAsync(c).then( function(){
                    m.initializeAsync().then( function(){
                        video.src = URL.createObjectURL(m);
                        video.play();
                    });
                }

                self();

                $(this).bind('video', self);
            });

            log('Initialising video, Running callback');
            callback.call($r);

            return $r;

        }, function (e){ log(e); });
        
    };

})(jQuery);
