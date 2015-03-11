Starter_Service.factory('pushUp',['orientationTrackingService','vibrationNotificationService','countingService',function(orientationTrackingService,vibrationNotificationService,countingService){
    var targets = ['y<-50','y>-10'];
    var trackIds = [];
    var counterTrackIds = {};
    return {
        add: function(){
            var trackId = orientationTrackingService.add();
            var counterTrackId = countingService.addCounting(12);
            orientationTrackingService.setTask(trackId,targets,true,
                function(tracker){
                    vibrationNotificationService.vibrateNotice();
                },
                function(tracker){
                    countingService.accumulate(counterTrackId);
                }
            );
            trackIds.push(trackId);
            counterTrackIds[trackId] = counterTrackId;
            return trackId;
        },
        del: function(trackId) {
            orientationTrackingService.del(trackId);
            coungintService.del(counterTrackIds[trackId]);
        },
        setFinishedCallback: function(trackId, callback){
            var counterTrackId = counterTrackIds[trackId];
            countingService.setFinishCallback(counterTrackId, function(event,args){
                callback(args);
            });
        },
        setChangedCallback: function(trackId, callback){
            var counterTrackId = counterTrackIds[trackId];
            countingService.setChangedCallback(counterTrackId, function(event,args){
                callback(args);
            });
        }
    }
}]);

