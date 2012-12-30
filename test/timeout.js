var T = require("./timbre.debug.js");
var assert = require("assert");

describe('T("timeout")', function() {
    it("new", function() {
        assert.equal(T("timeout").toString(), "TimeoutNode");
    });
    it("default properties", function() {
        var t = T("timeout");
        assert.equal(t.timeout,  1000);
        assert.equal(t.currentTime, 0);
    });
    it("fixed control-rate", function() {
        var t = T("timeout");
        assert.isTrue(t.isKr );
        assert.isFalse(t.isAr);
        t.ar();
        assert.isTrue(t.isKr );
        assert.isFalse(t.isAr);
    });
    it("process() / emit 'ended' when timeout", function(done) {
        T("timeout", {timeout:100}).on("ended", function() {
            this.stop();
            done();
        }).start();
    });
    it("bang() reset timer", function(done) {
        var t = T("timeout", {timeout:50}, function() {
            assert(false);
        }).start();
        var count = 0;
        var tid = setInterval(function() {
            t.bang();
            if (count++ >= 5) {
                t.stop();
                clearInterval(tid);
                done();
            }
        }, 20);
    });
    it("cannot restart with 'deferred' option", function(done) {
        var check = true;
        T("timeout", {timeout:20, deferred:true}, function() {
            assert(check);
        }).then(function() {
            check = false;
            this.start();
            done();
        }).start();
    });
    if (timbre.envtype === "browser") {
        describe("jQuery", function() {
            it("$.Deferred", function(done) {
                var t = T("timeout", {timeout:100, deferred:true});
                $.when(t.promise()).then(function() {
                    done();
                });
                t.start();
            });
        });
    }
    after(function() {
        assert.equal(timbre.isPlaying, false);
    });
});