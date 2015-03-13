Starter_Service

/**
 *
 */
    .factory('ticketService', function ($rootScope) {
        var tickets = {};
        /**
         * guid
         * @returns {string}
         */
        var generateGuid = function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }
        var countObj = function (o) {
            var t = typeof o;
            if (t == 'string') {
                return o.length;
            } else if (t == 'object') {
                var n = 0;
                for (var i in o) {
                    n++;
                }
                return n;
            }
            return false;
        }
        return {
            getTicket: function (ticketId) {
                if (tickets[ticketId] == undefined) {
                    return null;
                } else {
                    return tickets[ticketId];
                }
            },
            addTicket: function () {
                var guid = generateGuid();
                tickets[guid] = {};
                //$event.$emit(EVT_ADD_TICKET);
                $rootScope.$emit(EVT_ADD_TICKET);
                return guid;
            },
            delTicket: function (ticketId) {
                delete tickets[ticketId];
            },
            getTicketCount: function () {
                return countObj(tickets);
            },
            emitEvent: function (ticketId, type) {
                $rootScope.$emit(ticketId + "-" + type, tickets[ticketId]);
            },
            onEvent: function (ticketId, type, callback) {
                $rootScope.$on(ticketId + "-" + type, callback);
            },
            offEvent: function (ticketId, type) {
                $rootScope.$destroy(ticketId + "-" + type);
            }
        }
    })



    .factory('SoundService',function($cordovaNativeAudio){

        /*$cordovaNativeAudio
            .preloadSimple('getOne', 'audio/di.mp3')
            .then(function (msg) {
                console.log(msg);
            }, function (error) {
                alert(error);
            });

        $cordovaNativeAudio
            .preloadSimple('go', 'audio/readygo.mp3')
            .then(function (msg) {
                console.log(msg);
            }, function (error) {
                alert(error);
            });

*/

        return {
            tip:function(){
              //  $cordovaNativeAudio.play('getOne');
            },
            start:function(){
              //  $cordovaNativeAudio.play('go');
            }
        }
    })

/**
 *
 */
    .factory('abstractTrackingService', function (ticketService) {
        var category = 'tracking';
        return {
            addTrackingItem: function () {
                var ticketId = ticketService.addTicket();
                var ticket = ticketService.getTicket(ticketId)
                ticket['category'] = category;
                return ticketId;
            },
            delTrackingItem: function (trackingId) {
                ticketService.delTicket(trackingId);
            },
            getTrackingItem: function (trackingId) {
                return ticketService.getTicket(trackingId);
            }
        }
    })

    .factory('orientationTrackingService', function ($rootScope, abstractTrackingService,SoundService, $cordovaDeviceOrientation) {
        var type = 'orientation';
        var currentTrackerCounter = 0;
        var isSensorStarted = false;
        var watchId = null;
        var currentX = 0;
        var currentY = 0;
        var currentZ = 0;
        var timestamp = 0;
        var trackers = [];

        var refreshWatching = function () {
            console.log("x:"+currentX+"  y:"+currentY+"  z:"+currentZ);
            for (var i = 0; i < trackers.length; i++) {
                var tracker = abstractTrackingService.getTrackingItem(trackers[i]);
                if (tracker.enabled != undefined && tracker.enabled != null && tracker.enabled) {
                    var x = currentX;
                    var y = currentY;
                    var z = currentZ;
                    var timestamp = timestamp;
                    //getTask
                    var targets = tracker.targets;
                    var stepCallback = tracker.stepCallback;
                    var taskCallback = tracker.taskCallback;
                    var step = tracker.step;
                    var done = true;
                    for (var k = 0; k < targets.length; k++) {
                        if (!eval(targets[step])) {
                            done = false;
                            break;
                        }
                    }
                    if (done) {
                        tracker['x'] = x;
                        tracker['y'] = y;
                        tracker['z'] = z;
                        tracker['timestamp'] = timestamp;
                        stepCallback(tracker);
                        step++;
                        if (step >= targets.length) {
                            taskCallback(tracker);
                            step = 0;

                        }
                        tracker.step = step;

                    }
                }
            }
        }

        var startWatching = function () {
            try {
                watchId = $cordovaDeviceOrientation.watchHeading({frequency: 200}).then(null, function (error) {
                }, function (result) {
                    console.log("检测结果：===========================");
					console.log(result);
                    currentX = result.trueHeading;
                    currentY = result.y;
                    currentZ = result.z;
                    timestamp = result.timestamp;
                    refreshWatching();
                }, function (err) {

                });
            } catch (error) {
                console.log(JSON.stringify(error));
            }
            isSensorStarted = true;
        };
        var stopWatching = function () {
            if (watchId != null)
                $cordovaDeviceOrientation.clearWatch(watchId);
            isSensorStarted = false;
        }

        return {
            add: function () {

                var trackerId = abstractTrackingService.addTrackingItem();
                var tracker = abstractTrackingService.getTrackingItem(trackerId);
                tracker['type'] = type;
                tracker['enabled'] = false;
                trackers.push(trackerId);
                if (isSensorStarted == false) {
                    startWatching();
                }
                return trackerId;
            },
            del: function (trackerId) {
                abstractTrackingService.delTrackingItem(trackerId);
                trackers = removeElement(trackerId, trackers);
                if (trackers.length <= 0) {
                    stopWatching();
                }
                return true;
            },
            /*

             */
            setTask: function (trackerId, targets, enabled, stepCallback, taskCallback) {
                var tracker = abstractTrackingService.getTrackingItem(trackerId);
                tracker['targets'] = targets;
                tracker['enabled'] = enabled;
                tracker['step'] = 0;
                tracker['stepCallback'] = stepCallback;
                tracker['taskCallback'] = taskCallback;
            }
        }
    })
    .factory('vibrationNotificationService', function ($cordovaVibration) {
        var actionNoticeLength = 100;
        return {
            vibrateNotice: function () {
                $cordovaVibration.vibrate(actionNoticeLength);
            }
        }
    })
    .factory('countingService', function (ticketService) {
        var targetTicket = null;
        var category = "counting";
        var type = "basic_counting";
        return {
            addCounting: function (target) {
                var ticketId = ticketService.addTicket();
                var ticket = ticketService.getTicket(ticketId);
                ticket['target'] = target;
                ticket['category'] = category;
                ticket['type'] = type;
                ticket['current'] = 0;
                return ticketId;
            },
            del: function (ticketId) {
                try {
                    ticketService.offEvent(ticketId, EVT_COUNTING_FINISHED);
                    ticketService.offEvent(ticketId, EVT_COUNTING_CHANGED);
                    ticketService.delTicket(ticketId);
                } catch (error) {

                }
            },
            accumulate: function (ticketId) {
                var ticket = ticketService.getTicket(ticketId);
                ticket.current++;
                ticketService.emitEvent(ticketId, EVT_COUNTING_CHANGED, ticket);
                if (ticket.current == ticket.target) {
                    ticketService.emitEvent(ticketId, EVT_COUNTING_FINISHED, ticket);
                }
            },
            decumulate: function (ticketId) {
                var ticket = ticketService.getTicket(ticketId);
                ticket.current--;
                ticketService.emitEvent(ticketId, EVT_COUNTING_CHANGED, ticket);
            },
            setFinishCallback: function (ticketId, callback) {
                ticketService.onEvent(ticketId, EVT_COUNTING_FINISHED, callback);
            },
            setChangedCallback: function (ticketId, callback) {
                ticketService.onEvent(ticketId, EVT_COUNTING_CHANGED, callback);
            },
            getCurrentCount: function (ticketId) {
                var ticket = ticketService.getTicket(ticketId);
                return ticket.current;
            }
        }
    })
    .factory('countdownService', function (ticketService) {
        var category = 'countdown';
        var type = 'basic_countdown';
        return {
            addCountdown: function (target, startTime) {
                var ticketId = ticketService.addTicket();
                var ticket = ticketService.getTicket(ticketId);
                if (startTime == 0) {
                    startTime = Math.round(new Date().getTime() / 1000);
                }
            }

        }
    });
