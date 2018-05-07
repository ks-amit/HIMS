void function(){
    var test = require('tape')
    var rt = require('../index.js')

    function expected_number_of_duplicates(n,d){
        // http://en.wikipedia.org/wiki/Birthday_problem#Collision_counting
        return n - d + d * Math.pow((d-1)/d,n)
    }

    test('type', function(t){
        t.plan(1)
        t.equal(typeof rt(1), 'string')
    })

    test('length', function(t){
        var i = 4
        t.plan(i+2)
        while ( i -- ) {
            var l = Math.pow(i,i)
            t.equal(rt(l).length, l)
        }
        t.equal(rt(-1), undefined)
        t.equal(rt([]), undefined)
    })


    // This test can sometimes fail if you are very unlucky. Especially for expected dups sizes.
    // However I wanted to see how the number of duplicates change for different salt, and selection sizes.
    function testDups(klen, count, salt){
        var tokgen = rt.create(salt||rt.salt())
        var exp_dups = expected_number_of_duplicates(count,Math.pow(tokgen.salt().length, klen))
        // I expect a deviation less than 10% , but
        // actual deviation in real life is much smaller because the generated sizes of the keys are much larger
        // which of course results in much less duplicates compared to key generated size
        var ndups = Math.ceil(exp_dups*1.1)
        test('number of duplicates less than '+ndups+
             ' (expected: '+exp_dups+') from '+count+
             ' keys of length '+klen, function(t){
            t.plan(1)
            var i = count
            var keys = []
            var duplicates = []
            var k = ''

            function same(k,c){ return k == c }

            while ( i -- ) {
                k = tokgen(klen, salt)
                if ( keys.some(same.bind(null,k)) ) duplicates.push(k)
                keys.push(k)
            }

            var msg = '# actual number of duplicates ' +  duplicates.length
            if ( duplicates.length < ndups ) {
                t.pass(msg)
            } else {
                t.fail(msg)
            }
        })
    }

    var abc = 'abcdefghijklmnopqrstuvwxyz'
    var ABC = abc.toUpperCase()
    testDups(3,3000)
    testDups(3,3000, abc)
    testDups(3,5000, rt.salt()+ABC)

    test('generator', function(t){
        t.plan(1)
        var hash = 'qropadb'
        var gen = rt.gen(hash)
        var token = gen(20)
        t.ok(token.split('').every(function(letter){
          return hash.indexOf(letter) > -1
        }))

    })

}()
