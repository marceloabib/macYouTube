(function($) {
	var	linkHref = '';
	
	$.fn.macYouTube = function(options) {
			
			var vOptions = $.extend({}, $.fn.macYouTube.defaults, options);

			// oculta a div
			$(this).hide();

			// Titulo
			if (vOptions.titulo) {
				$(this).append('<h2>'+ vOptions.texto +'</h2>');
			}

			// Listagem dos videos
			$(this).append('<div id="youtube-videos"></div>');

			//Oculta a div dos videos
			$("div#youtube-videos").hide();

			//Recupera o texto digitado no loader
			var pl = $(vOptions.loaderText);
			$(this).append(pl);

			//Mostra o loading enquanto iremos puxar os videos
			$(this).show();			

			//Adiciona o footer(rodape) com a assinatura do video
			$(this).append('<div id="footer">Veja nosso canal: <a href="http://www.youtube.com/' + vOptions.pUsuario + '" target="_blank">http://www.youtube.com.br/' + vOptions.pUsuario + '</a></div>');

			var montaLinha = '';
			var montaEstrela = '';
			$.getJSON("http://gdata.youtube.com/feeds/base/users/" + vOptions.pUsuario + "/uploads?alt=json-in-script&callback=?", function(data) {
				if(data)
				{
					$(pl).remove();

					$.each(data.feed.entry, function(i,item){
						
						//Recuperando o ID do video
						linkHref = linkHref + item.link[0].href;
						vPosInicioHref = linkHref.indexOf("v=", 1);
						vPosFinalHref = linkHref.indexOf("&", 1);
						pIdYoutube = linkHref.substring(vPosInicioHref+2,vPosFinalHref);
						
						//Procuramos aonde esta as views e puxamos o valor
						var vProcuraContent = jQuery(item.content.$t).find("table > tbody > tr:first > td:last");	
						vViews = $(vProcuraContent).find("div:eq(1)").text();

						//Avaliações
						vAvaliacoes = $(vProcuraContent).find("div:eq(3)").text();
						
						//Recuperando o tempo do video
						var vProcuraTime = jQuery(item.content.$t).find("table > tbody > tr:last > td:first");	
						vTime = $(vProcuraTime).find("span:eq(1)").text();
						

						//Inicializando a data para colocar no formato brasileiro(dd/mm/yyyy)
						var vData = new Date(item.published.$t);

						//Coloca no formato brasileiro
						montaData = vData.getDate() + "/" + (vData.getMonth()+1) + "/" + (vData.getYear()+1900);
						
						//Monta a div onde ficara todos os videos
						montaLinha = montaLinha + "<div class='youtube-videos'>";
						montaLinha = montaLinha + "<span class='titulo'>" + item.title.$t + "</span><br/>";
						montaLinha = montaLinha + "<span class='imagem'><a href='" + item.link[0].href + "'><img src='http://i.ytimg.com/vi/" + pIdYoutube + "/default.jpg' /></a></span><br/>";
						montaLinha = montaLinha + "<span class='idyoutube'>ID do video: " + pIdYoutube + "</span><br/>";
						montaLinha = montaLinha + "<span class='link'>Url: " + item.link[0].href + "</span><br/>";
						montaLinha = montaLinha + "<span class='datapuclicacao'>" + montaData + "</span> - ";
						montaLinha = montaLinha + "<span class='views'>" + vViews.replace('Views','Exibi&ccedil;&otilde;es') + "</span><br/>";
						montaLinha = montaLinha + "<span class='avaliacoes'>" + vAvaliacoes.replace('ratings','Avalia&ccedil;&otilde;es') + "</span><br/>";
						montaLinha = montaLinha + "<span class='tempo'>Tempo: " + vTime + "</span><br/>";
						montaLinha = montaLinha + "<span class='estrelas'>";
						//Procurando as estrelas e adicionando na nossa div
						$(vProcuraContent).find("div:eq(2) > img").each(function(){
							montaLinha = montaLinha + '<img src="' + $(this).attr("src") + '" alt="" title="" />';
							
						});
						montaLinha = montaLinha + "</span><br/><hr/>";
						montaLinha = montaLinha + "</div>";	

						//Aplica a div montada na ID dos videos.
						$("div[id*=youtube-videos]").append(montaLinha);
						
						montaLinha = '';	
						linkHref = '';					

						//Limitando para quantos itens deseja colocar			    
						if(vOptions.itens){
							if ( i == vOptions.numItens -1 ) return false;
						}
					  });
					
					//Quando passar o mouse em cima da DIV ele muda de cor.
					$("div#youtube-videos div").hover(function () {
						  $(this).addClass("hoverYoutube");
						},
						function () {
						  $(this).removeClass("hoverYoutube");
						}
					  );	
				}
			});

			// Mostrar os videos
			if (vOptions.slideIn) {
				$("div#youtube-videos").slideDown(1000);
			}		

			 // plugin defaults
			$.fn.macYouTube.defaults = {
				pUsuario: null,
				titulo: true,
				texto: "Meus Videos",
				loaderText: "",
				slideIn: true,
				itens: false,
				numItens: 0
			};

	}

})(jQuery);
