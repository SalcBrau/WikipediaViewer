$(document).ready(function() {
  var allowed = true, $articles, regExp, $search = $('#search'), $input = $('input'), show = [], noShow = [], $article, text;
  // hide divs that will contain contain articles
  hideArticles(); 
  // ----- EVENT HANDLERS -----
    // search wikipedia button - gets text from input and sends request to find articles
    $search.click(function() {
      $search.prop('disabled', true);
      window.setTimeout(function() {
        $search.prop('disabled', false);
      }, 1000);
      searchArticles($input.val());
    });

    // code so that clicking enter sends search
    $("input").focus(function() {
      $("input").keydown(function(e) {
        var key = e.which;
        if (key === 13 && allowed) {
          allowed = false;
          window.setTimeout(function() {
            allowed = true;
          }, 1000);
          searchArticles($input.val());
        } 
      });
    });
    // hover over article handler
    $('.article').hover(function() {
      $(this).css({height: "175px", width: "1025px", fontSize: "21px", boxShadow: "0px 0px 25px 19px #52498c"});
      $('#' + this.id + " a").css({
        fontSize: "45px"
      });
    }, function() {
      $(this).css({height: "150px", width: "1000px", fontSize: "20px", boxShadow: "0px 0px"})
      $('#' + this.id + " a").css({
        fontSize: "40px"
      });
    });
  // ----- FUNCTIONS ------
    // code to shrink title
    function shrink() {
      $('.article').css({"visibility": "visible"});
      $('body').animate({marginTop: "0px"}, 600);
      $("h1").animate(
        { fontSize: "45px", marginBottom: "5px", marginTop: "15px"},
        900
      );
      $("input").animate(
        { height: "35px", width: "360px", fontSize: "20px" },
        650
      );
      $("button").animate(
        {
          width: "130px",
          fontSize: "15px",
          height: "35px",
          marginTop: "-30px",
          marginRight: "5px",
          marginLeft: "5px"
        },
        800
      );
    }

    // conducts the actual search
    function searchArticles(searched) {
      $articles = $(".article");
      // if search is empty get ride of articles - if not shrink title and conduct search 
      regExp = /.+/;
      $articles.fadeOut(400);
      window.setTimeout(function() {
        if (regExp.test(searched)) {
          shrink();
          var url =
            "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
            searched +
            "&format=json&callback=?";
          $.getJSON(url, function(data) {
            var articles = document.getElementsByClassName("article");
            var j = 0;
            for (var i = 0; i < data[1].length; i++) {
              if (data[2][i].length > 299) {
                text = data[2][i].slice(0, 298)
                if (data[2][i].charAt(299) === " ") {
                  text = text + "....";
                } else {
                  text = text.slice(0, text.lastIndexOf(" ")) + "....";
                }
              } else 
                text = data[2][i];
              if (text !== "") {
                articles[j].innerHTML =
                  "<a target='_blank' href='" +
                  data[3][i] +
                  "'<h2>" +
                  data[1][i] +
                  "</h2></a><br><p>" +
                  text +
                  "</p>";
                  j++;
              } 
            }
          
            while (j < articles.length) {
              articles[j].innerHTML = "";
              j++;
            }
          });
          window.setTimeout(function() {
            $articles.each(function() {
              $article = $(this);
              if ($article.html() !== "") $article.fadeTo(400, 1);
            });
          }, 450);
        } else {
          $articles.html("");
        }
      }, 300);
    }

    // hides all articles - ran once document is ready
    function hideArticles() {
      $(".article").hide(0);
    } 
});
