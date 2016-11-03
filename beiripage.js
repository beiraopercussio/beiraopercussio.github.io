var translationsEN = {
  PHOTOS: 'Photos',
  VIDEOS: 'Videos',
  CONTACT: 'Contact',
  ABOUT_US: 'About Beirão',
  GIGS: 'gigs',
  FANS: 'fans',
  BROKEN_DRUM_STICK: 'drum sticks broken',
  YOUR_GIG: {
      TITLE: 'Your gig',
      HEADING: 'Our next gig could be yours.',
      EMAIL: 'Email us',
      CALL: 'Call us'
  },
  ABOUT_TEXT: 'Beirão Percussió is a musical project that is born in the neighborhood of Sagrada Família in the year 2013, with the goal of cheering up the crowd with energetic rythms and vitality. Our work is founded in brasilian music spiced up with a personal touch and our own style. We are a band of 20 members ready to turn any event into a full-blown party. <br><br>As a percussion band, we are open to take part into any kind of events; from events that are traditionally matched with percussion in the catalan culture (correfocs, tabalades, trobades de bèsties, cercaviles...), to openings, private events, sport activities, concerts... We are passionate about making any audience enjoy an event no matter its nature. Our performances are apt to any event as long as they are to be accompanied by a special sound.',
  ABOUT_DATE: 'Barcelona / Sagrada Família / 25 April 2013'
};

var translationsCA = {
    PHOTOS: 'Fotos',
    VIDEOS: 'Videos',
    CONTACT: 'Contacte',
    ABOUT_US: 'Què és Beirão',
    GIGS: 'bolos',
    FANS: 'fans',
    BROKEN_DRUM_STICK: 'baquetes trencades',
    YOUR_GIG: {
        TITLE: 'El teu bolo',
        HEADING: 'La nostra propera actuació pot ser la teva.',
        EMAIL: 'Envia\'ns un mail',
        CALL: 'Truca\'ns'
    },
    ABOUT_TEXT: 'Beirão Percussió és un projecte que neix al barri de la Sagrada Família de Barcelona l’any 2013, amb la intenció d’animar el públic a través de ritmes plens d’energia i vitalitat. El nostre repertori està inspirat en la música brasilera, reflectint, a més, un toc personal i un estil propi. Som un grup format per uns 20 components disposats a fer una autèntica festa de qualsevol esdeveniment. <br><br>Com a grup de percussió, estem oberts a participar en tot tipus d’esdeveniments; des d’actes que tradicionalment s’acompanyen de percussió (correfocs, tabalades, trobades de bèsties, rues i cercaviles...), fins a inauguracions, celebracions privades, classes esportives, concerts... Ens apassiona fer gaudir a tots els públics sigui quin sigui el format de  l’acte.  Els nostres espectacles s’adapten a qualsevol ocasió, sempre que es vulgui acompanyar d’una sonoritat especial.',
    ABOUT_DATE: 'Barcelona / Sagrada Família / 25 d\'Abril, 2013'
};

var app = angular.module('BeiriPage', ['pascalprecht.translate',
                                        'youtube-embed',
                                        'duScroll',
                                        'angular-carousel',
                                        'cfp.hotkeys',
                                        'ngAnimate']);

app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('ca', translationsCA);
    $translateProvider.preferredLanguage('ca');
    $translateProvider.fallbackLanguage('ca');
}]);

app.value('duScrollDuration', 600);
app.value('duScrollOffset', 50);

app.directive('navscroll', function($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            var YOFFSET_SHRINK = 420;

            if (this.pageYOffset > YOFFSET_SHRINK) {
                scope.shrinkNav = true;
            } else {
                scope.shrinkNav = false;
            }

            scope.$apply();
        });
    };
});

app.controller('BeiriController', ['$scope', '$document', '$http', 'hotkeys', '$translate',
                                    function($scope, $document, $http, hotkeys, $translate) {
    $scope.aboutExpanded = false;
    $scope.contactExpanded = false;
    $scope.likes = '---';
    var ctrl = this;
    ctrl.carouselVisible = false;
    ctrl.carouselItems = false;
    ctrl.carouselIndex = 0;
    ctrl.carouselType = '';

    ctrl.coverPictures = [
        'img/cover/slide1.jpg',
        'img/cover/slide2.jpg',
        'img/cover/slide3.jpg',
        // 'img/cover/slide4.jpg',
        'img/cover/slide5.jpg'
    ];

    hotkeys.add({
        combo: 'right',
        description: 'Next image in carousel',
        callback: function() {
            ctrl.carouselIndex++;
        }
    });

    hotkeys.add({
        combo: 'left',
        description: 'Previous image in carousel',
        callback: function() {
            ctrl.carouselIndex--;
        }
    });

    hotkeys.add({
        combo: 'esc',
        description: 'Closes carousel',
        callback: function() {
            ctrl.carouselVisible = false;
        }
    });

    this.collapseYears = function(exceptionYear) {
        for (var i = 0; i < $scope.years.length; i++) {
            if ($scope.years[i].year != exceptionYear) {
                $scope.years[i].expanded = false;
            }
        }
    };

    this.collapseAll = function(exceptionId) {
        if ('about' != exceptionId) {
            $scope.aboutExpanded = false;
        }

        if ('contact' != exceptionId) {
            $scope.contactExpanded = false;
        }

        for (var i in $scope.years) {
            for (var j in $scope.years[i].gigs) {
                if ($scope.years[i].gigs[j].id != exceptionId) {
                    $scope.years[i].gigs[j].expanded = false;
                }
            }
        }
    };

    this.showVideoCarousel = function () {
        this.carouselItems = [];
        ctrl.carouselType = 'video';

        for (var i in $scope.years) {
            for (var j in $scope.years[i].gigs) {
                var gig = $scope.years[i].gigs[j];

                if (gig.content && gig.content.youtube) {
                    this.carouselItems.push(gig.content.youtube);
                }
            }
        }

        this.carouselVisible = true;
        this.carouselIndex = 0;
    };

    this.showPhotoCarousel = function (gig, index) {
        // TODO: This function hurts my eyes. Please, refactor.
        this.carouselItems = [];
        ctrl.carouselType = 'photo';

        if (gig) {
            var pictures = gig.content.pictures.fullsize;
            for (var k in pictures) {
                this.carouselItems.push({url: pictures[k], title: gig.title});
            }
        } else {
            for (var i in $scope.years) {
                for (var j in $scope.years[i].gigs) {
                    var gig = $scope.years[i].gigs[j];

                    if (gig.content && gig.content.pictures
                                    && gig.content.pictures.fullsize) {
                        var pictures = gig.content.pictures.fullsize;
                        for (var k in pictures) {
                            this.carouselItems.push({url: pictures[k], title: gig.title});
                        }
                    }
                }
            }
        }

        this.carouselVisible = true;
        this.carouselIndex = index? index: 0;
    };

    this.carouselHasNext = function () {
        return this.carouselIndex < (this.carouselItems.length-1);
    };

    this.carouselHasPrev = function () {
        return this.carouselIndex > 0;
    }

    this.prevItem = function () {
        if (this.carouselIndex > 0) {
            this.carouselIndex--;
        }
    };

    this.nextItem = function () {
        if (this.carouselIndex < this.carouselItems.length) {
            this.carouselIndex++;
        }
    };

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
        localize(langKey);
    };

    loadYears();
    loadLikes();

    function localize(locale) {
        for (var i in $scope.years) {
            var year = $scope.years[i];

            for (var j in year.gigs) {
                if (year.gigs[j]['title_' + locale]) {
                    year.gigs[j].title = year.gigs[j]['title_' + locale];
                }

                if (year.gigs[j]['date_' + locale]) {
                    year.gigs[j].date = year.gigs[j]['date_' + locale];
                }

                if (year.gigs[j].content && year.gigs[j].content['desc_' +locale]) {
                    year.gigs[j].content.desc = year.gigs[j].content['desc_' +locale];
                }
            }
        }
    }

    function loadYears() {
        $http.get('years.json')
            .success(function (years) {
                var gigId = 1;
                for (var i in years) {
                    var year = years[i];

                    for (var j in year.gigs) {
                        year.gigs[j].id = gigId;
                        gigId++;
                    }
                }

                var totalGigs = 0;

                for(var i in years) {
                    totalGigs += years[i].ngigs;
                }

                $scope.years = years;
                localize('ca');
                $scope.totalGigs = totalGigs;

                $scope.years[0].expanded = true;
                ctrl.collapseYears($scope.years[0].year);
                ctrl.collapseAll();
        });
    }

    function loadLikes() {
        $http.get('https://graph.facebook.com/fql?q=SELECT%20fan_count%20FROM%20page%20WHERE%20page_id=410888445612474')
            .success(function (data) {
                $scope.likes = data.data[0].fan_count;
            })
            .error(function () {
                $scope.likes = '---';
            });
    }
}]);
