Starter_Service

/**
 *
 */
    .factory('ticketService', function ($rootScope,$cordovaVibration) {




        var _vibrate = {
            vibrateNotice:function (duration) {
                $cordovaVibration.vibrate(duration || 100);
            }
        }







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
            addTicket: function (ticketOption) {
                var guid = generateGuid();
                var _ticketItem = {
                    guid:guid
                };

                tickets[guid]  =angular.extend(_ticketItem,ticketOption);

                $rootScope.$emit(EVT_ADD_TICKET);

                return  tickets[guid] ;
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

    .factory('SoundService', function ($cordovaNativeAudio) {

        $cordovaNativeAudio
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


        return {
            tip: function () {
                $cordovaNativeAudio.play('getOne');
            },
            start: function () {
                $cordovaNativeAudio.play('go');
            }
        }
    })

/**
 *
 */
    .factory('abstractTrackingService', function (ticketService) {
        var category = 'tracking';
        return {
            addTrackingItem: function (options) {
                options = angular.extend({
                    category:category
                },options)

                return ticketService.addTicket(options);


            },
            delTrackingItem: function (trackingId) {
                ticketService.delTicket(trackingId);
            },
            getTrackingItem: function (trackingId) {
                return ticketService.getTicket(trackingId);
            }
        }
    })

    .factory('orientationTrackingService', function ($rootScope, abstractTrackingService, SoundService,countingService, $cordovaDeviceOrientation) {
        var type = 'orientation';
        var isSensorStarted = false;
        var watchId = null;

        var current = {
            x: 0,
            y: 0,
            z: 0,
            timestamp: 0
        }

        var _trackers = [];

        var setCurrentXYZ = function (x, y, z, timestamp) {
            current = {
                x: x,
                y: y,
                z: z,
                timestamp: timestamp
            }
            console.log(current);
        }

        var refreshWatching = function () {
            console.log("x:" + current.x + "  y:" + current.y + "  z:" + current.z);
            for (var i = 0; i < _trackers.length; i++) {
                var tracker = abstractTrackingService.getTrackingItem(_trackers[i]);
                if (tracker.enabled != undefined && tracker.enabled != null && tracker.enabled) {
                    var x = current.x;
                    var y = current.y;
                    var z = current.z;
                    var timestamp = current.timestamp;
                    //getTask
                    var touchstone = tracker.touchstone;
                    var stepCallback = tracker.stepCallback;
                    var taskCallback = tracker.taskCallback;
                    var step = tracker.step;
                    var done = true;
                    for (var k = 0; k < touchstone.length; k++) {
                        if (!eval(touchstone[step])) {
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
                        if (step >= touchstone.length) {
                            taskCallback(tracker);
                            step = 0;

                        }
                        tracker.step = step;

                    }
                }
            }
        }

        /**
         * 寮€濮嬫娴?
         */
        var startWatching = function () {
            try {
                watchId = $cordovaDeviceOrientation.watchHeading({frequency: 200}).then(null, function (error) {

                }, function (result) {

                    setCurrentXYZ(result.trueHeading, result.y, result.z, result.timestamp);
                    refreshWatching();

                }, function (err) {

                });
            } catch (error) {
                console.log(JSON.stringify(error));
            }
            isSensorStarted = true;
        };
        /**
         * 鍋滄妫€娴?
         */
        var stopWatching = function () {
            if (watchId != null){
                $cordovaDeviceOrientation.clearWatch(watchId);
            }
            isSensorStarted = false;
        }







        var setTask = function (trackerId, touchstone, enabled,counterTrackId) {


        }




        return {
            /**
             *
             * @param counterTrackId
             * @param options={
             *
             *
             * }
             * @returns {*|exports.guid|_ticketItem.guid|Compiler.guid|c.guid|d.guid}
             */
            create: function (counterTrackId,options) {

                var tracker = abstractTrackingService.addTrackingItem({
                    type:type,
                    enabled:false
                });
                _trackers.push(tracker.guid);

                if (isSensorStarted == false) {
                    startWatching();
                }


                var defaultTask = {
                    touchstone:options.touchstone,
                    step:0,
                    enabled:true,
                    stepCallback: function(tracker){

                        SoundService.tip();// vibrationNotificationService.vibrateNotice();
                    },
                    taskCallback:function(tracker){
                        countingService.accumulate(counterTrackId);
                    }
                }

                angular.extend(tracker,defaultTask);



                return tracker.guid;
            },
            del: function (trackerId) {
                abstractTrackingService.delTrackingItem(trackerId);
                _trackers = removeElement(trackerId, _trackers);
                if (_trackers.length <= 0) {
                    stopWatching();
                }
                return true;
            }

        }
    })

    .factory('countingService', function (ticketService) {
        var category = "counting";
        var type = "basic_counting";

        /**
         * 设置训练数目完成后的反馈
         * @param trackId
         * @param callback
         */
        var setFinishCallback= function (ticketId, callback) {
            ticketService.onEvent(ticketId, EVT_COUNTING_FINISHED, callback);
        }
        /**
         * 设置标准动作完成后的反馈
         * @param trackId
         * @param callback
         */
        var setChangedCallback= function (ticketId, callback) {
            ticketService.onEvent(ticketId, EVT_COUNTING_CHANGED, callback);
        }




        return {
            /**
             *
             * @param options={
             *   target:
             *
             *
             * }
             * @returns {*|exports.guid|_ticketItem.guid|Compiler.guid|c.guid|d.guid}
             */
            create: function (options) {
                var opts =  angular.extend({
                    category:category,
                    type:type,
                    current:0
                },options);

                var ticketItem = ticketService.addTicket(opts);

                var counterTrackId = ticketItem.guid;


                setChangedCallback(counterTrackId,opts.change);
                setFinishCallback(counterTrackId, opts.finish);

                return counterTrackId;
            },
            del: function (ticketId) {

                ticketService.offEvent(ticketId, EVT_COUNTING_FINISHED);
                ticketService.offEvent(ticketId, EVT_COUNTING_CHANGED);
                ticketService.delTicket(ticketId);

            },
            accumulate: function (ticketId) {
                var ticket = ticketService.getTicket(ticketId);
                ticket.current++;
                ticketService.emitEvent(ticketId, EVT_COUNTING_CHANGED, ticket);
                if (ticket.current == ticket.goal) {
                    ticketService.emitEvent(ticketId, EVT_COUNTING_FINISHED, ticket);
                }
            },
            decumulate: function (ticketId) {
                var ticket = ticketService.getTicket(ticketId);
                ticket.current--;
                ticketService.emitEvent(ticketId, EVT_COUNTING_CHANGED, ticket);
            },
            setFinishCallback:setFinishCallback,
            setChangedCallback: setChangedCallback,
            getCurrentCount: function (ticketId) {
                var ticket = ticketService.getTicket(ticketId);
                return ticket.current;
            }
        }
    })

;
