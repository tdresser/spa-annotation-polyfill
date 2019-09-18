(() => {
    // const measure = performance.measure
    const measure = function(a, b, c){
        console.log(a);
        console.log(b);
        // console.log(c);
    }

    const softNavigations = [];

    window.getSoftNavigations = function(){
        return softNavigations;
    }

    window.getSoftNavigationOrigin = function() {
        if (softNavigations.length === 0)
            return 0;
        return softNavigations[softNavigations.length - 1][1];
    }

    performance.measure = function(measureName, startOrMeasureOptions, endMark) {
        const event = startOrMeasureOptions['event'];

        // TODO - throw if this event is stale - e.g., we've already produced a frame.
        if (event) {
            if (event && event.timeStamp && startOrMeasureOptions['startTime']) {
                throw "performance.measure() called with both event timestamp and start time.";
            }

            startOrMeasureOptions['startTime'] = event.timeStamp;
            // This should trigger surfacing this duration in eventTiming.
        }

        // TODO - why are we getting negative numbers here?
        if(startOrMeasureOptions['softNavigation']) {
            softNavigations.push([measureName, startOrMeasureOptions['startTime']]);
            window.dispatchEvent(new Event('softNavigation'));
        }

        const until = startOrMeasureOptions['until'];
        if (until) {
            until.then(() => {
                startOrMeasureOptions['endTime'] = performance.now();
                measure.call(performance, measureName, startOrMeasureOptions, endMark)
            })
            return;
        }
        measure.call(performance, measureName, startOrMeasureOptions, endMark);
    }
})();