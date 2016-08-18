!function () {
	function a(a, b) {
		var c,
		d,
		e = null,
		f = a.document;
		return f.selection ? (c = f.selection.createRange(), c.collapse(b), c.parentElement()) : (a.getSelection && (d = a.getSelection(), d.rangeCount > 0 && (c = d.getRangeAt(0), e = c[b ? "startContainer" : "endContainer"], 3 === e.nodeType && (e = e.parentNode))), e)
	}
	if (function () {
		var a = {};
		!function (a, b) {
			a.VERSION = "1.0.0",
			a.COMPILER_REVISION = 4,
			a.REVISION_CHANGES = {
				1 : "<= 1.0.rc.2",
				2 : "== 1.0.0-rc.3",
				3 : "== 1.0.0-rc.4",
				4 : ">= 1.0.0"
			},
			a.helpers = {},
			a.partials = {};
			var c = Object.prototype.toString,
			d = "[object Function]",
			e = "[object Object]";
			a.registerHelper = function (b, d, f) {
				if (c.call(b) === e) {
					if (f || d)
						throw new a.Exception("Arg not supported with multiple helpers");
						a.Utils.extend(this.helpers, b)
					} else
						f && (d.not = f), this.helpers[b] = d
				},
				a.registerPartial = function (b, d) {
					c.call(b) === e ? a.Utils.extend(this.partials, b) : this.partials[b] = d
				},
				a.registerHelper("helperMissing", function (a) {
					if (2 === arguments.length)
						return b;
					throw new Error("Missing helper: '" + a + "'")
				}),
				a.registerHelper("blockHelperMissing", function (b, e) {
					var f = e.inverse || function () {},
					g = e.fn,
					h = c.call(b);
					return h === d && (b = b.call(this)),
					b === !0 ? g(this) : b === !1 || null == b ? f(this) : "[object Array]" === h ? b.length > 0 ? a.helpers.each(b, e) : f(this) : g(b)
				}),
				a.K = function () {},
				a.createFrame = Object.create || function (b) {
					a.K.prototype = b;
					var c = new a.K;
					return a.K.prototype = null,
					c
				},
				a.logger = {
					DEBUG : 0,
					INFO : 1,
					WARN : 2,
					ERROR : 3,
					level : 3,
					methodMap : {
						0 : "debug",
						1 : "info",
						2 : "warn",
						3 : "error"
					},
					log : function (b, c) {
						if (a.logger.level <= b) {
							var d = a.logger.methodMap[b];
							"undefined" != typeof console && console[d] && console[d].call(console, c)
						}
					}
				},
				a.log = function (b, c) {
					a.logger.log(b, c)
				},
				a.registerHelper("each", function (b, e) {
					var f,
					g = e.fn,
					h = e.inverse,
					i = 0,
					j = "",
					k = c.call(b);
					if (k === d && (b = b.call(this)), e.data && (f = a.createFrame(e.data)), b && "object" == typeof b)
						if (b instanceof Array)
							for (var l = b.length; l > i; i++)
								f && (f.index = i), j += g(b[i], {
									data : f
								});
						else
							for (var m in b)
								b.hasOwnProperty(m) && (f && (f.key = m), j += g(b[m], {
										data : f
									}), i++);
					return 0 === i && (j = h(this)),
					j
				}),
				a.registerHelper("if", function (b, e) {
					var f = c.call(b);
					return f === d && (b = b.call(this)),
					!b || a.Utils.isEmpty(b) ? e.inverse(this) : e.fn(this)
				}),
				a.registerHelper("unless", function (b, c) {
					return a.helpers["if"].call(this, b, {
						fn : c.inverse,
						inverse : c.fn
					})
				}),
				a.registerHelper("with", function (b, e) {
					var f = c.call(b);
					return f === d && (b = b.call(this)),
					a.Utils.isEmpty(b) ? void 0 : e.fn(b)
				}),
				a.registerHelper("log", function (b, c) {
					var d = c.data && null != c.data.level ? parseInt(c.data.level, 10) : 1;
					a.log(d, b)
				});
				var f = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
				a.Exception = function () {
					for (var a = Error.prototype.constructor.apply(this, arguments), b = 0; b < f.length; b++)
						this[f[b]] = a[f[b]]
				},
				a.Exception.prototype = new Error,
				a.SafeString = function (a) {
					this.string = a
				},
				a.SafeString.prototype.toString = function () {
					return this.string.toString()
				};
				var g = {
					"&" : "&amp;",
					"<" : "&lt;",
					">" : "&gt;",
					'"' : "&quot;",
					"'" : "&#x27;",
					"`" : "&#x60;"
				},
				h = /[&<>"'`]/g,
				i = /[&<>"'`]/,
				j = function (a) {
					return g[a] || "&amp;"
				};
				a.Utils = {
					extend : function (a, b) {
						for (var c in b)
							b.hasOwnProperty(c) && (a[c] = b[c])
					},
					escapeExpression : function (b) {
						return b instanceof a.SafeString ? b.toString() : null == b || b === !1 ? "" : (b = b.toString(), i.test(b) ? b.replace(h, j) : b)
					},
					isEmpty : function (a) {
						return a || 0 === a ? "[object Array]" === c.call(a) && 0 === a.length ? !0 : !1 : !0
					}
				},
				a.VM = {
					template : function (b) {
						var c = {
							escapeExpression : a.Utils.escapeExpression,
							invokePartial : a.VM.invokePartial,
							programs : [],
							program : function (b, c, d) {
								var e = this.programs[b];
								return d ? e = a.VM.program(b, c, d) : e || (e = this.programs[b] = a.VM.program(b, c)),
								e
							},
							merge : function (b, c) {
								var d = b || c;
								return b && c && (d = {}, a.Utils.extend(d, c), a.Utils.extend(d, b)),
								d
							},
							programWithDepth : a.VM.programWithDepth,
							noop : a.VM.noop,
							compilerInfo : null
						};
						return function (d, e) {
							e = e || {};
							var f = b.call(c, a, d, e.helpers, e.partials, e.data),
							g = c.compilerInfo || [],
							h = g[0] || 1,
							i = a.COMPILER_REVISION;
							if (h !== i) {
								if (i > h) {
									var j = a.REVISION_CHANGES[i],
									k = a.REVISION_CHANGES[h];
									throw "Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + j + ") or downgrade your runtime to an older version (" + k + ")."
								}
								throw "Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + g[1] + ")."
							}
							return f
						}
					},
					programWithDepth : function (a, b, c) {
						var d = Array.prototype.slice.call(arguments, 3),
						e = function (a, e) {
							return e = e || {},
							b.apply(this, [a, e.data || c].concat(d))
						};
						return e.program = a,
						e.depth = d.length,
						e
					},
					program : function (a, b, c) {
						var d = function (a, d) {
							return d = d || {},
							b(a, d.data || c)
						};
						return d.program = a,
						d.depth = 0,
						d
					},
					noop : function () {
						return ""
					},
					invokePartial : function (c, d, e, f, g, h) {
						var i = {
							helpers : f,
							partials : g,
							data : h
						};
						if (c === b)
							throw new a.Exception("The partial " + d + " could not be found");
						if (c instanceof Function)
							return c(e, i);
						if (a.compile)
							return g[d] = a.compile(c, {
									data : h !== b
								}), g[d](e, i);
						throw new a.Exception("The partial " + d + " could not be compiled when running in runtime-only mode")
					}
				},
				a.template = a.VM.template,
				"function" == typeof define && define.amd && define("handlebars", a)
			}
			(a)
		}
			(), define("../locales/de", {
				insert_image : "Bild einfügen",
				insert_video : "Video einfügen",
				insert_website : "Webseite einfügen",
				add_slide : "Folie hinzufügen",
				remove_slide : "Folie entfernen",
				slides : "Folien",
				overview : "Übersicht",
				open : "Öffnen",
				save : "Speichern",
				save_as : "Speichern als...",
				new_ : "Neu",
				text : "Text",
				image : "Bild",
				video : "Video",
				website : "Webseite",
				present : "Präsentieren",
				"export" : "Exportieren...",
				"import" : "Importieren...",
				cut : "Ausschneiden",
				copy : "Kopieren",
				paste : "Einfügen",
				"delete" : "Löschen",
				undo : "Rückgängig",
				redo : "Wiederholen",
				shapes : "Formen",
				single_slide_bg : "Single Slide Background",
				invisible : "Unsichtbar",
				reset : "Zurücksetzen",
				go : "Gehe",
				strut_exporter_json : {
					explain : "Dies erlaubt Ihnen, eine Datei auf Ihrem Computer zu speichern, die Sie später wieder in Strut importieren können.",
					click_below : "Klicken sie zum Herunterladen auf das Symbol unten"
				},
				background : "Hintergrund",
				surface : "Oberfläche"
			}), define("../locales/en", {
				insert_image : "Insert Image",
				insert_video : "Insert Video",
				insert_website : "Insert Website",
				add_slide : "Add Slide",
				remove_slide : "Remove Slide",
				slides : "Slides",
				overview : "Overview",
				open : "",
				save : "Save",
				save_as : "Save as...",
				new_ : "New",
				text : "Text",
				image : "Image",
				video : "Video",
				website : "Website",
				present : "Present",
				"export" : "Export...",
				"import" : "Import...",
				cut : "Cut",
				copy : "Copy",
				paste : "Paste",
				"delete" : "Delete",
				undo : "Undo",
				redo : "Redo",
				shapes : "Shapes",
				single_slide_bg : "Single Slide Background",
				invisible : "Invisible",
				reset : "Reset",
				go : "Go",
				strut_exporter_json : {
					explain : "This allows you to save a file on your computer that you can import back into Strut later.",
					click_below : "Click below to download"
				},
				background : "Background",
				surface : "Surface"
			}), define("../locales/es", {
				insert_image : "Insertar imagen",
				insert_video : "Insertarr vídeo",
				insert_website : "Insertar sitio web",
				add_slide : "Añadir    diapositiva",
				remove_slide : "Eliminar diapositiva",
				slides : "Diapositivas",
				overview : "Resumen",
				open : "Abrir",
				save : "Guardar",
				save_as : "Guardar como...",
				new_ : "Nuevo",
				text : "Texto",
				image : "Imagen",
				video : "Vídeo",
				website : "Sitio Web",
				present : "Presentar",
				"export" : "Exportar...",
				"import" : "Importar...",
				cut : "Cortar",
				copy : "Copiar",
				paste : "Pegar",
				"delete" : "Borrar",
				undo : "Deshacer",
				redo : "Rehacer",
				shapes : "Formas",
				single_slide_bg : "Single Slide Background",
				invisible : "Invisible",
				reset : "Reajustar",
				go : "Ir",
				strut_exporter_json : {
					explain : "Esto te permite guardar un archivo en tu ordenador que podrás importar en Strut posteriormente.",
					click_below : "Haz Copiarlick abajo para descargar."
				},
				background : "Fondo",
				surface : "Superficie"
			}), define("../locales/fr", {
				insert_image : "Insérer une image",
				insert_video : "Insérer une vidéo",
				insert_website : "Insérer un site web",
				add_slide : "Ajouter une diapo",
				remove_slide : "Supprimer la diapo",
				slides : "Diapos",
				overview : "Panorama",
				open : "Ouvrir",
				save : "Enregistrer",
				save_as : "Enregistrer sous...",
				new_ : "Nouveau",
				text : "Texte",
				image : "Image",
				video : "Vidéo",
				website : "Site web",
				present : "Courant",
				"export" : "Exporter...",
				"import" : "Importer...",
				cut : "Couper",
				copy : "Copier",
				paste : "Coller",
				"delete" : "Effacer",
				undo : "Annuler",
				redo : "Refaire",
				shapes : "Formes",
				single_slide_bg : "Single Slide Background",
				invisible : "Invisible",
				reset : "Réinitialiser",
				go : "Aller",
				strut_exporter_json : {
					explain : "Vous pouvez sauvegarder la présentation dans fichier que vous pourrez réimporter dans Strut plus tard",
					click_below : "Cliquer ci-dessous pour télécharger le fichier"
				},
				background : "Fond",
				surface : "Surface"
			}), define("../locales/nl", {
				insert_image : "Afbeelding invoegen",
				insert_video : "Video invoegen",
				insert_website : "Website invoegen",
				add_slide : "Dia toevoegen",
				remove_slide : "Dia verwijderen",
				slides : "Dia's",
				overview : "Overzicht",
				open : "Openen",
				save : "Opslaan",
				save_as : "Opslaan als...",
				new_ : "Nieuw",
				text : "Tekst",
				image : "Afbeelding",
				video : "Video",
				website : "Website",
				present : "Presenteren",
				"export" : "Exporteren...",
				"import" : "Importeren...",
				cut : "Knippen",
				copy : "Kopiëren",
				paste : "Plakken",
				"delete" : "Verwijderen",
				undo : "Ongedaan maken",
				redo : "Opnieuw",
				shapes : "Vormen",
				single_slide_bg : "Achtergrond per dia",
				invisible : "Onzichtbaar",
				reset : "Terugzetten",
				go : "Gaan",
				strut_exporter_json : {
					explain : "Deze functie maakt het mogelijk om een bestand op te slaan, welke later weer in Strut geïmporteerd kan worden.",
					click_below : "Klik hieronder om te downloaden"
				},
				background : "Achtergrond",
				surface : "Werkblad"
			}), define("../locales/ru", {
				insert_image : "Вставить картинку",
				insert_video : "Вставить видео",
				insert_website : "Вставить ссылку",
				add_slide : "Добавить слайд",
				remove_slide : "Удалить слайд",
				slides : "Слайды",
				overview : "Эффекты",
				open : "Открыть",
				save : "Сохранить",
				save_as : "Сохранить как...",
				new_ : "Создать",
				text : "Текст",
				image : "Картинка",
				video : "Видео",
				website : "Ссылка",
				present : "Показать",
				"export" : "Экспортировать...",
				"import" : "Импортировать...",
				cut : "Вырезать",
				copy : "Копировать",
				paste : "Вставить",
				"delete" : "Удалить",
				undo : "Отменить",
				redo : "Повторить",
				shapes : "Фигуры",
				single_slide_bg : "Фон одного слайда",
				invisible : "Невидимый",
				reset : "Сброс",
				go : "Вперёд",
				strut_exporter_json : {
					explain : "Здесь можно скачать файл, который при необходимости можно будет импортировать в Strut.",
					click_below : "Для этого нажмите ниже."
				},
				background : "Фон",
				surface : "Холст"
			}), define("lang", ["../locales/de", "../locales/en", "../locales/es", "../locales/fr", "../locales/nl", "../locales/ru", "handlebars"], function (a, b, c, d, e, f, g) {
				var h = {
					en : b,
					de : a,
					es : c,
					fr : d,
					nl : e,
					ru : f
				},
				i = window.navigator.language || window.navigator.userLanguage,
				j = h[i.split("-")[0]] || h.en;
				return g.registerHelper("lang", function (a) {
					return j[a]
				}),
				j
			}), define("compiled-templates", ["handlebars"], function (a) {
				return this.JST = this.JST || {},
				this.JST["strut.etch_extension/align"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var f,
						g = "",
						h = "function",
						i = this.escapeExpression;
						return g += '<a href="#" \n	class="btn btn-small etch-',
						(f = c.button) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.button, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '" title="',
						(f = c.title) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.title, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"><i class="icon-align-',
						(f = c.icon) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.icon, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"></i></a>'
					}),
				this.JST["strut.etch_extension/colorChooser"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var f,
						g = "",
						h = "function",
						i = this.escapeExpression;
						return g += '<input class="color-chooser colorpicker etch-',
						(f = c.button) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.button, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '" />'
					}),
				this.JST["strut.etch_extension/defaultButton"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var f,
						g = "",
						h = "function",
						i = this.escapeExpression;
						return g += '<a href="#" \n	class="btn btn-small etch-',
						(f = c.button) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.button, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '" title="',
						(f = c.title) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.title, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"><span>',
						(f = c.display) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.display, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + "</span></a>"
					}),
				this.JST["strut.etch_extension/fontFamilySelection"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						'<div class="btn-group">\n	<button class="btn btn-inverse dropdown-toggle btn-small fontFamilyBtn" data-toggle="dropdown" title="Choose the font family"><span class="text">Lato</span><span class="caret"></span></button>\n	<ul class="dropdown-menu menuBarOption" data-option="fontFamily">\n		<li>\n                  <a class="lato" href="#" data-value="\'Lato\', sans-serif">Lato</a>\n                  <a class="ubuntu" href="#" data-value="\'Ubuntu\', sans-serif">Ubuntu</a>\n                  <a class="abril" href="#" data-value="\'Abril Fatface\', cursive">Abril</a>\n                  <a class="hammersmith" href="#" data-value="\'Hammersmith One\', sans-serif">Hammersmith One</a>\n                  <a class="fredoka" href="#" data-value="\'Fredoka One\', cursive">Fredoka One</a>\n                  <a class="gorditas" href="#" data-value="\'Gorditas\', cursive">Gorditas</a>\n                  <a class="pressstart" href="#" data-value="\'Press Start 2P\', cursive">Press Start 2P</a>\n                  <a class="droidsansmono" href="#" data-value="\'Droid Sans Mono\', monospace">Droid Sans Mono</a>\n		</li>\n	</ul>\n</div>'
					}),
				this.JST["strut.etch_extension/fontSizeSelection"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						'<div class="btn-group">\n	<a class="btn btn-small btn-inverse dropdown-toggle" data-toggle="dropdown" title="Choose the font size"><span class="text fontSizeReadout">72</span>\n		<span class="caret"></span></a>\n	<ul class="dropdown-menu menuBarOption" data-option="fontSize">\n		<li>\n                  <a href="#" data-value="144">144</a>\n                  <a href="#" data-value="96">96</a>\n                  <a href="#" data-value="72">72</a>\n			<a href="#" data-value="64">64</a>\n                  <a href="#" data-value="48">48</a>\n                  <a href="#" data-value="36">36</a>\n                  <a href="#" data-value="24">24</a>\n                  <a href="#" data-value="16">16</a>\n                  <a href="#" data-value="12">12</a>\n                  <a href="#" data-value="8">8</a>\n		</li>\n     	</ul>\n</div>'
					}),
				this.JST["strut.header/Header"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						'<div class="navbar navbar-inverse span12">\n	<div class="navbar-inner">\n		<ul class="nav">\n			<li class="logo-holder">\n			</li>\n			<li class="divider-vertical">\n			</li>\n		</ul>\n		<ul class="nav">\n			<li class="create-comp-buttons">\n				<div class="btn-group iconBtns">\n				</div>\n			</li>\n		</ul>\n		<ul class="nav theme-buttons">\n		</ul>\n		<ul class="nav pull-right">\n			<li class="divider-vertical">\n			</li>\n			<li class="mode-buttons">\n			</li>\n		</ul>\n	</div>\n</div>'
					}),
				this.JST["strut.logo_button/Logo"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						'<a class="btn logo btn-plast dropdown-toggle" data-toggle="dropdown">\n	<span class="logo-bg"></span>\n    <span class="caret"></span>\n</a>\n<ul class="dropdown-menu">\n</ul>'
					}),
				this.JST["strut.presentation_generator.bespoke/BespokeTemplate"] = a.template(function (a, b, c, d, e) {
						function f(a, b, e) {
							var f,
							j,
							k,
							l = "";
							return l += "\n	<style>\n	",
							(f = c.customStylesheet) ? f = f.call(a, {
									hash : {},
									data : b
								}) : (f = a.customStylesheet, f = typeof f === q ? f.apply(a) : f),
							(f || 0 === f) && (l += f),
							l += "\n	</style>\n	<style>\n	",
							f = a.customBackgrounds,
							f = null == f || f === !1 ? f : f.attributes,
							f = null == f || f === !1 ? f : f.bgs,
							f = typeof f === q ? f.apply(a) : f,
							j = t.call(a, f, {
									hash : {},
									inverse : p.noop,
									fn : p.program(2, g, b),
									data : b
								}),
							(j || 0 === j) && (l += j),
							l += "\n	</style>\n	",
							j = p.invokePartial(d.PerSlideSurfaceStylesheet, "PerSlideSurfaceStylesheet", a, c, d, b),
							(j || 0 === j) && (l += j),
							l += '\n	<div id="main" class="',
							k = {
								hash : {},
								inverse : p.noop,
								fn : p.program(4, h, b),
								data : b
							},
							f = c.isBGClass || a.isBGClass,
							j = f ? f.call(a, a.surface, k) : s.call(a, "isBGClass", a.surface, k),
							(j || 0 === j) && (l += j),
							l += "strut-surface ",
							(j = c.cannedTransition) ? j = j.call(a, {
									hash : {},
									data : b
								}) : (j = a.cannedTransition, j = typeof j === q ? j.apply(a) : j),
							l += r(j) + '">\n		<article class="innerBg">\n			',
							f = a.slides,
							f = null == f || f === !1 ? f : f.models,
							f = typeof f === q ? f.apply(a) : f,
							j = t.call(a, f, {
									hash : {},
									inverse : p.noop,
									fn : p.programWithDepth(6, i, b, e),
									data : b
								}),
							(j || 0 === j) && (l += j),
							l += "\n		</article>\n	</div>\n"
						}
						function g(a, b) {
							var e,
							f = "";
							return f += "\n		",
							e = p.invokePartial(d.CustomBgStylesheet, "CustomBgStylesheet", a, c, d, b),
							(e || 0 === e) && (f += e),
							f += "\n	"
						}
						function h(a, b) {
							var d,
							e = "";
							return (d = c.surface) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.surface, d = typeof d === q ? d.apply(a) : d),
							e += r(d) + " "
						}
						function i(a, b, d) {
							var e,
							f,
							g = "";
							return g += "\n				",
							f = {
								hash : {},
								inverse : p.noop,
								fn : p.programWithDepth(7, j, b, a, d),
								data : b
							},
							(e = c.attributes) ? e = e.call(a, f) : (e = a.attributes, e = typeof e === q ? e.apply(a) : e),
							c.attributes || (e = t.call(a, e, f)),
							(e || 0 === e) && (g += e),
							g += "\n			"
						}
						function j(a, b, d, e) {
							var f,
							g,
							h,
							i = "";
							return i += '\n					<section class="',
							h = {
								hash : {},
								inverse : p.noop,
								fn : p.program(8, k, b),
								data : b
							},
							f = c.determineBG || d.determineBG,
							g = f ? f.call(a, d, e, h) : s.call(a, "determineBG", d, e, h),
							(g || 0 === g) && (i += g),
							i += " slideContainer strut-slide-",
							(g = c.index) ? g = g.call(a, {
									hash : {},
									data : b
								}) : (g = a.index, g = typeof g === q ? g.apply(a) : g),
							i += r(g) + '" style="width: 1024px; height: 768px;" data-bespoke-state="strut-slide-',
							(g = c.index) ? g = g.call(a, {
									hash : {},
									data : b
								}) : (g = a.index, g = typeof g === q ? g.apply(a) : g),
							i += r(g),
							h = {
								hash : {},
								inverse : p.noop,
								fn : p.program(8, k, b),
								data : b
							},
							f = c.determineSurface || d.determineSurface,
							g = f ? f.call(a, d, e, h) : s.call(a, "determineSurface", d, e, h),
							(g || 0 === g) && (i += g),
							i += '">\n						<div class="themedArea">\n              			',
							h = {
								hash : {},
								inverse : p.noop,
								fn : p.program(8, k, b),
								data : b
							},
							f = c.marked || a.marked,
							g = f ? f.call(a, a.markdown, h) : s.call(a, "marked", a.markdown, h),
							(g || 0 === g) && (i += g),
							i += "\n              			</div>\n						",
							h = {
								hash : {},
								inverse : p.noop,
								fn : p.program(10, l, b),
								data : b
							},
							(g = c.components) ? g = g.call(a, h) : (g = a.components, g = typeof g === q ? g.apply(a) : g),
							c.components || (g = t.call(a, g, h)),
							(g || 0 === g) && (i += g),
							i += "\n					</section>\n				"
						}
						function k() {
							var a = "";
							return a
						}
						function l(a, b) {
							var d,
							e,
							f,
							g = "";
							return g += "\n							",
							f = {
								hash : {},
								inverse : p.noop,
								fn : p.program(8, k, b),
								data : b
							},
							d = c.renderComponent || a.renderComponent,
							e = d ? d.call(a, a, f) : s.call(a, "renderComponent", a, f),
							(e || 0 === e) && (g += e),
							g += "\n						"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var m,
						n,
						o = "",
						p = this,
						q = "function",
						r = this.escapeExpression,
						s = c.helperMissing,
						t = c.blockHelperMissing;
						return n = {
							hash : {},
							inverse : p.noop,
							fn : p.programWithDepth(1, f, e, b),
							data : e
						},
						(m = c.attributes) ? m = m.call(b, n) : (m = b.attributes, m = typeof m === q ? m.apply(b) : m),
						c.attributes || (m = t.call(b, m, n)),
						(m || 0 === m) && (o += m),
						o += "\n"
					}),
				this.JST["strut.presentation_generator.handouts/HandoutsTemplate"] = a.template(function (a, b, c, d, e) {
						function f(a, b, d) {
							var e,
							f,
							h = "";
							return h += '\n<style type="text/css">\n',
							(e = c.customStylesheet) ? e = e.call(a, {
									hash : {},
									data : b
								}) : (e = a.customStylesheet, e = typeof e === o ? e.apply(a) : e),
							(e || 0 === e) && (h += e),
							h += '\n</style>\n\n<div class="notes-handout">\n',
							e = a.slides,
							e = null == e || e === !1 ? e : e.models,
							e = typeof e === o ? e.apply(a) : e,
							f = p.call(a, e, {
									hash : {},
									inverse : m.noop,
									fn : m.programWithDepth(2, g, b, d),
									data : b
								}),
							(f || 0 === f) && (h += f),
							h += "\n</div>\n"
						}
						function g(a, b, d) {
							var e,
							f,
							g = "";
							return g += "\n",
							f = {
								hash : {},
								inverse : m.noop,
								fn : m.programWithDepth(3, h, b, a, d),
								data : b
							},
							(e = c.attributes) ? e = e.call(a, f) : (e = a.attributes, e = typeof e === o ? e.apply(a) : e),
							c.attributes || (e = p.call(a, e, f)),
							(e || 0 === e) && (g += e),
							g += '\n</div>\n<div class="notes">\n	Notes:\n</div>\n</div>\n'
						}
						function h(a, b, d, e) {
							var f,
							g,
							h,
							k = "";
							return k += '\n<div class="slide-and-notes">\n<div class="slide ',
							h = {
								hash : {},
								inverse : m.noop,
								fn : m.program(4, i, b),
								data : b
							},
							f = c.determineBG || d.determineBG,
							g = f ? f.call(a, d, e, h) : n.call(a, "determineBG", d, e, h),
							(g || 0 === g) && (k += g),
							k += ' slideContainer" style="',
							h = {
								hash : {},
								inverse : m.noop,
								fn : m.program(4, i, b),
								data : b
							},
							f = c.slideBGImg || d.slideBGImg,
							g = f ? f.call(a, d, h) : n.call(a, "slideBGImg", d, h),
							(g || 0 === g) && (k += g),
							k += '">\n<div class="reveal themedArea">\n',
							h = {
								hash : {},
								inverse : m.noop,
								fn : m.program(4, i, b),
								data : b
							},
							f = c.marked || a.marked,
							g = f ? f.call(a, a.markdown, h) : n.call(a, "marked", a.markdown, h),
							(g || 0 === g) && (k += g),
							k += "\n</div>\n",
							h = {
								hash : {},
								inverse : m.noop,
								fn : m.program(6, j, b),
								data : b
							},
							(g = c.components) ? g = g.call(a, h) : (g = a.components, g = typeof g === o ? g.apply(a) : g),
							c.components || (g = p.call(a, g, h)),
							(g || 0 === g) && (k += g),
							k += "\n"
						}
						function i() {
							var a = "";
							return a
						}
						function j(a, b) {
							var d,
							e,
							f,
							g = "";
							return g += "\n",
							f = {
								hash : {},
								inverse : m.noop,
								fn : m.program(4, i, b),
								data : b
							},
							d = c.renderComponent || a.renderComponent,
							e = d ? d.call(a, a, f) : n.call(a, "renderComponent", a, f),
							(e || 0 === e) && (g += e),
							g += "\n"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var k,
						l,
						m = this,
						n = c.helperMissing,
						o = "function",
						p = c.blockHelperMissing;
						return l = {
							hash : {},
							inverse : m.noop,
							fn : m.programWithDepth(1, f, e, b),
							data : e
						},
						(k = c.attributes) ? k = k.call(b, l) : (k = b.attributes, k = typeof k === o ? k.apply(b) : k),
						c.attributes || (k = p.call(b, k, l)),
						k || 0 === k ? k : ""
					}),
				this.JST["strut.presentation_generator.impress/ComponentContainer"] = a.template(function (a, b, c, d, e) {
						function f() {
							var a = "";
							return a
						}
						function g(a, b) {
							var d,
							e = "";
							return e += "rotate(",
							(d = c.rotate) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.rotate, d = typeof d === p ? d.apply(a) : d),
							e += q(d) + "rad)"
						}
						function h(a, b) {
							var d,
							e = "";
							return e += "skewX(",
							(d = c.skewX) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.skewX, d = typeof d === p ? d.apply(a) : d),
							e += q(d) + "rad)"
						}
						function i(a, b) {
							var d,
							e = "";
							return e += "skewY(",
							(d = c.skewY) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.skewY, d = typeof d === p ? d.apply(a) : d),
							e += q(d) + "rad)"
						}
						function j(a, b) {
							var d,
							e,
							g,
							h = "";
							return g = {
								hash : {},
								inverse : r.noop,
								fn : r.program(1, f, b),
								data : b
							},
							d = c.round || a.round,
							e = d ? d.call(a, (d = a.scale, null == d || d === !1 ? d : d.width), g) : s.call(a, "round", (d = a.scale, null == d || d === !1 ? d : d.width), g),
							(e || 0 === e) && (h += e),
							h += "px"
						}
						function k(a, b) {
							var d,
							e,
							g,
							h = "";
							return g = {
								hash : {},
								inverse : r.noop,
								fn : r.program(1, f, b),
								data : b
							},
							d = c.round || a.round,
							e = d ? d.call(a, (d = a.scale, null == d || d === !1 ? d : d.height), g) : s.call(a, "round", (d = a.scale, null == d || d === !1 ? d : d.height), g),
							(e || 0 === e) && (h += e),
							h += "px"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var l,
						m,
						n,
						o = "",
						p = "function",
						q = this.escapeExpression,
						r = this,
						s = c.helperMissing;
						return o += '<div class="componentContainer ',
						(l = c.customClasses) ? l = l.call(b, {
								hash : {},
								data : e
							}) : (l = b.customClasses, l = typeof l === p ? l.apply(b) : l),
						o += q(l) + '" style="top: ',
						n = {
							hash : {},
							inverse : r.noop,
							fn : r.program(1, f, e),
							data : e
						},
						l = c.round || b.round,
						m = l ? l.call(b, b.y, n) : s.call(b, "round", b.y, n),
						(m || 0 === m) && (o += m),
						o += "px; left: ",
						n = {
							hash : {},
							inverse : r.noop,
							fn : r.program(1, f, e),
							data : e
						},
						l = c.round || b.round,
						m = l ? l.call(b, b.x, n) : s.call(b, "round", b.x, n),
						(m || 0 === m) && (o += m),
						o += "px; -webkit-transform: ",
						m = c["if"].call(b, b.rotate, {
								hash : {},
								inverse : r.noop,
								fn : r.program(3, g, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += " ",
						m = c["if"].call(b, b.skewX, {
								hash : {},
								inverse : r.noop,
								fn : r.program(5, h, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += " ",
						m = c["if"].call(b, b.skewY, {
								hash : {},
								inverse : r.noop,
								fn : r.program(7, i, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += "; -moz-transform: ",
						m = c["if"].call(b, b.rotate, {
								hash : {},
								inverse : r.noop,
								fn : r.program(3, g, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += " ",
						m = c["if"].call(b, b.skewX, {
								hash : {},
								inverse : r.noop,
								fn : r.program(5, h, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += " ",
						m = c["if"].call(b, b.skewY, {
								hash : {},
								inverse : r.noop,
								fn : r.program(7, i, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += "; transform: ",
						m = c["if"].call(b, b.rotate, {
								hash : {},
								inverse : r.noop,
								fn : r.program(3, g, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += " ",
						m = c["if"].call(b, b.skewX, {
								hash : {},
								inverse : r.noop,
								fn : r.program(5, h, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += " ",
						m = c["if"].call(b, b.skewY, {
								hash : {},
								inverse : r.noop,
								fn : r.program(7, i, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += "; width: ",
						m = c["if"].call(b, b.scale, {
								hash : {},
								inverse : r.noop,
								fn : r.program(9, j, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += "; height: ",
						m = c["if"].call(b, b.scale, {
								hash : {},
								inverse : r.noop,
								fn : r.program(11, k, e),
								data : e
							}),
						(m || 0 === m) && (o += m),
						o += ';">\n',
						m = r.invokePartial(d.TransformContainer, "TransformContainer", b, c, d, e),
						(m || 0 === m) && (o += m),
						o
					}),
				this.JST["strut.presentation_generator.impress/Image"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var f,
						g = "",
						h = this,
						i = "function",
						j = this.escapeExpression;
						return f = h.invokePartial(d.ComponentContainer, "ComponentContainer", b, c, d, e),
						(f || 0 === f) && (g += f),
						g += '\n<img src="',
						(f = c.src) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.src, f = typeof f === i ? f.apply(b) : f),
						g += j(f) + '"></img>\n</div>\n</div>'
					}),
				this.JST["strut.presentation_generator.impress/ImpressTemplate"] = a.template(function (a, b, c, d, e) {
						function f(a, b, e) {
							var f,
							j,
							l,
							m = "";
							return m += '\n<style type="text/css">\n',
							(f = c.customStylesheet) ? f = f.call(a, {
									hash : {},
									data : b
								}) : (f = a.customStylesheet, f = typeof f === v ? f.apply(a) : f),
							(f || 0 === f) && (m += f),
							m += "\n</style>\n<style>\n",
							f = a.customBackgrounds,
							f = null == f || f === !1 ? f : f.attributes,
							f = null == f || f === !1 ? f : f.bgs,
							f = typeof f === v ? f.apply(a) : f,
							j = y.call(a, f, {
									hash : {},
									inverse : u.noop,
									fn : u.program(2, g, b),
									data : b
								}),
							(j || 0 === j) && (m += j),
							m += "\n</style>\n",
							j = u.invokePartial(d.PerSlideSurfaceStylesheet, "PerSlideSurfaceStylesheet", a, c, d, b),
							(j || 0 === j) && (m += j),
							m += '\n<!-- This is a work around / hack to get the user\'s browser to download the fonts \n if they decide to save the presentation. -->\n<div style="visibility: hidden; width: 0px; height: 0px">\n<img src="css/Lato-Bold.woff" />\n<img src="css/HammersmithOne.woff" />\n<img src="css/Droid-Sans-Mono.woff" />\n<img src="css/Gorditas-Regular.woff" />\n<img src="css/FredokaOne-Regular.woff" />\n<img src="css/Ubuntu.woff" />\n<img src="css/Ubuntu-Bold.woff" />\n<img src="css/PressStart2P-Regular.woff" />\n<img src="css/Lato-BoldItalic.woff" />\n<img src="css/AbrilFatface-Regular.woff" />\n<img src="css/Lato-Regular.woff" />\n</div>\n\n<div class="fallback-message">\n    <p>Your browser <b>doesn\'t support the features required</b> by impress.js, so you are presented with a simplified version of this presentation.</p>\n    <p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p>\n</div>\n\n<div class="bg ',
							l = {
								hash : {},
								inverse : u.noop,
								fn : u.program(4, h, b),
								data : b
							},
							f = c.isBGClass || a.isBGClass,
							j = f ? f.call(a, a.surface, l) : x.call(a, "isBGClass", a.surface, l),
							(j || 0 === j) && (m += j),
							m += 'strut-surface">\n<div class="bg innerBg">\n<div id="impress">\n	',
							f = a.slides,
							f = null == f || f === !1 ? f : f.models,
							f = typeof f === v ? f.apply(a) : f,
							j = y.call(a, f, {
									hash : {},
									inverse : u.noop,
									fn : u.programWithDepth(6, i, b, e),
									data : b
								}),
							(j || 0 === j) && (m += j),
							m += '\n	<div id="overview" class="step" data-x="',
							l = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							f = c.scaleX || a.scaleX,
							j = f ? f.call(a, a.overviewX, l) : x.call(a, "scaleX", a.overviewX, l),
							(j || 0 === j) && (m += j),
							m += '" data-y="',
							l = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							f = c.scaleY || a.scaleY,
							j = f ? f.call(a, a.overviewY, l) : x.call(a, "scaleY", a.overviewY, l),
							(j || 0 === j) && (m += j),
							m += '" data-scale="9"></div>\n	'
						}
						function g(a, b) {
							var e,
							f = "";
							return f += "\n	",
							e = u.invokePartial(d.CustomBgStylesheet, "CustomBgStylesheet", a, c, d, b),
							(e || 0 === e) && (f += e),
							f += "\n"
						}
						function h(a, b) {
							var d,
							e = "";
							return (d = c.surface) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.surface, d = typeof d === v ? d.apply(a) : d),
							e += w(d) + " "
						}
						function i(a, b, d) {
							var e,
							f,
							g = "";
							return g += "\n		",
							f = {
								hash : {},
								inverse : u.noop,
								fn : u.programWithDepth(7, j, b, a, d),
								data : b
							},
							(e = c.attributes) ? e = e.call(a, f) : (e = a.attributes, e = typeof e === v ? e.apply(a) : e),
							c.attributes || (e = y.call(a, e, f)),
							(e || 0 === e) && (g += e),
							g += "\n		</div>\n	"
						}
						function j(a, b, d, e) {
							var f,
							g,
							h,
							i = "";
							return i += '\n			<div class="step" data-state="strut-slide-',
							(f = c.index) ? f = f.call(a, {
									hash : {},
									data : b
								}) : (f = a.index, f = typeof f === v ? f.apply(a) : f),
							i += w(f),
							h = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							f = c.determineSurface || d.determineSurface,
							g = f ? f.call(a, d, e, h) : x.call(a, "determineSurface", d, e, h),
							(g || 0 === g) && (i += g),
							i += '" data-x="',
							h = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							f = c.scaleX || a.scaleX,
							g = f ? f.call(a, a.x, h) : x.call(a, "scaleX", a.x, h),
							(g || 0 === g) && (i += g),
							i += '" data-y="',
							h = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							f = c.scaleY || a.scaleY,
							g = f ? f.call(a, a.y, h) : x.call(a, "scaleY", a.y, h),
							(g || 0 === g) && (i += g),
							i += '" ',
							g = c["if"].call(a, a.rotateX, {
									hash : {},
									inverse : u.noop,
									fn : u.program(10, l, b),
									data : b
								}),
							(g || 0 === g) && (i += g),
							i += "  ",
							g = c["if"].call(a, a.rotateY, {
									hash : {},
									inverse : u.noop,
									fn : u.program(12, m, b),
									data : b
								}),
							(g || 0 === g) && (i += g),
							i += " ",
							g = c["if"].call(a, a.rotateZ, {
									hash : {},
									inverse : u.noop,
									fn : u.program(14, n, b),
									data : b
								}),
							(g || 0 === g) && (i += g),
							i += " ",
							g = c["if"].call(a, a.z, {
									hash : {},
									inverse : u.noop,
									fn : u.program(16, o, b),
									data : b
								}),
							(g || 0 === g) && (i += g),
							i += " ",
							g = c["if"].call(a, a.impScale, {
									hash : {},
									inverse : u.noop,
									fn : u.program(18, p, b),
									data : b
								}),
							(g || 0 === g) && (i += g),
							i += '>\n			<div class="',
							h = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							f = c.determineBG || d.determineBG,
							g = f ? f.call(a, d, e, h) : x.call(a, "determineBG", d, e, h),
							(g || 0 === g) && (i += g),
							i += " slideContainer strut-slide-",
							(g = c.index) ? g = g.call(a, {
									hash : {},
									data : b
								}) : (g = a.index, g = typeof g === v ? g.apply(a) : g),
							i += w(g) + '" style="width: 1024px; height: 768px;">\n			<div class="themedArea">\n			',
							h = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							f = c.marked || a.marked,
							g = f ? f.call(a, a.markdown, h) : x.call(a, "marked", a.markdown, h),
							(g || 0 === g) && (i += g),
							i += "\n			</div>\n			",
							h = {
								hash : {},
								inverse : u.noop,
								fn : u.program(20, q, b),
								data : b
							},
							(g = c.components) ? g = g.call(a, h) : (g = a.components, g = typeof g === v ? g.apply(a) : g),
							c.components || (g = y.call(a, g, h)),
							(g || 0 === g) && (i += g),
							i += "\n			</div>\n		"
						}
						function k() {
							var a = "";
							return a
						}
						function l(a, b) {
							var d,
							e,
							f,
							g = "";
							return g += 'data-rotate-x="',
							f = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							d = c.toDeg || a.toDeg,
							e = d ? d.call(a, a.rotateX, f) : x.call(a, "toDeg", a.rotateX, f),
							(e || 0 === e) && (g += e),
							g += '"'
						}
						function m(a, b) {
							var d,
							e,
							f,
							g = "";
							return g += 'data-rotate-y="',
							f = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							d = c.toDeg || a.toDeg,
							e = d ? d.call(a, a.rotateY, f) : x.call(a, "toDeg", a.rotateY, f),
							(e || 0 === e) && (g += e),
							g += '"'
						}
						function n(a, b) {
							var d,
							e,
							f,
							g = "";
							return g += 'data-rotate-z="',
							f = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							d = c.toDeg || a.toDeg,
							e = d ? d.call(a, a.rotateZ, f) : x.call(a, "toDeg", a.rotateZ, f),
							(e || 0 === e) && (g += e),
							g += '"'
						}
						function o(a, b) {
							var d,
							e = "";
							return e += 'data-z="',
							(d = c.z) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.z, d = typeof d === v ? d.apply(a) : d),
							e += w(d) + '"'
						}
						function p(a, b) {
							var d,
							e = "";
							return e += 'data-scale="',
							(d = c.impScale) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.impScale, d = typeof d === v ? d.apply(a) : d),
							e += w(d) + '"'
						}
						function q(a, b) {
							var d,
							e,
							f,
							g = "";
							return g += "\n			",
							f = {
								hash : {},
								inverse : u.noop,
								fn : u.program(8, k, b),
								data : b
							},
							d = c.renderComponent || a.renderComponent,
							e = d ? d.call(a, a, f) : x.call(a, "renderComponent", a, f),
							(e || 0 === e) && (g += e),
							g += "\n			"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var r,
						s,
						t = "",
						u = this,
						v = "function",
						w = this.escapeExpression,
						x = c.helperMissing,
						y = c.blockHelperMissing;
						return s = {
							hash : {},
							inverse : u.noop,
							fn : u.programWithDepth(1, f, e, b),
							data : e
						},
						(r = c.attributes) ? r = r.call(b, s) : (r = b.attributes, r = typeof r === v ? r.apply(b) : r),
						c.attributes || (r = y.call(b, r, s)),
						(r || 0 === r) && (t += r),
						t += '\n</div>\n</div>\n</div>\n<div class="hint">\n    <p>Use a spacebar or arrow keys to navigate</p>\n</div>'
					}),
				this.JST["strut.presentation_generator.impress/SVGContainer"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var f,
						g,
						h = "",
						i = "function",
						j = this.escapeExpression,
						k = this;
						return h += '<div class="componentContainer" style="top: ',
						(f = c.y) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.y, f = typeof f === i ? f.apply(b) : f),
						h += j(f) + "px; left: ",
						(f = c.x) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.x, f = typeof f === i ? f.apply(b) : f),
						h += j(f) + "px; width: " + j((f = b.scale, f = null == f || f === !1 ? f : f.width, typeof f === i ? f.apply(b) : f)) + "px; height: " + j((f = b.scale, f = null == f || f === !1 ? f : f.height, typeof f === i ? f.apply(b) : f)) + 'px;">\n',
						g = k.invokePartial(d.TransformContainer, "TransformContainer", b, c, d, e),
						(g || 0 === g) && (h += g),
						h
					}),
				this.JST["strut.presentation_generator.impress/SVGImage"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var f,
						g = "",
						h = this,
						i = "function",
						j = this.escapeExpression;
						return f = h.invokePartial(d.SVGContainer, "SVGContainer", b, c, d, e),
						(f || 0 === f) && (g += f),
						g += '\n<img src="',
						(f = c.src) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.src, f = typeof f === i ? f.apply(b) : f),
						g += j(f) + '" style="width: 100%; height: 100%"></img>\n</div>\n</div>'
					}),
				this.JST["strut.presentation_generator.impress/TextBox"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var f,
						g = "",
						h = this,
						i = "function",
						j = this.escapeExpression;
						return f = h.invokePartial(d.ComponentContainer, "ComponentContainer", b, c, d, e),
						(f || 0 === f) && (g += f),
						g += '\n<div style="font-size: ',
						(f = c.size) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.size, f = typeof f === i ? f.apply(b) : f),
						g += j(f) + 'px;" class="antialias">\n',
						(f = c.text) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.text, f = typeof f === i ? f.apply(b) : f),
						g += j(f) + "\n</div>\n</div>\n</div>"
					}),
				this.JST["strut.presentation_generator.impress/TransformContainer"] = a.template(function (a, b, c, d, e) {
						function f(a, b) {
							var d,
							e,
							f,
							h = "";
							return h += "scale(",
							f = {
								hash : {},
								inverse : j.noop,
								fn : j.program(2, g, b),
								data : b
							},
							d = c.round || a.round,
							e = d ? d.call(a, (d = a.scale, null == d || d === !1 ? d : d.x), f) : k.call(a, "round", (d = a.scale, null == d || d === !1 ? d : d.x), f),
							(e || 0 === e) && (h += e),
							h += ", ",
							f = {
								hash : {},
								inverse : j.noop,
								fn : j.program(2, g, b),
								data : b
							},
							d = c.round || a.round,
							e = d ? d.call(a, (d = a.scale, null == d || d === !1 ? d : d.y), f) : k.call(a, "round", (d = a.scale, null == d || d === !1 ? d : d.y), f),
							(e || 0 === e) && (h += e),
							h += ")"
						}
						function g() {
							var a = "";
							return a
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var h,
						i = "",
						j = this,
						k = c.helperMissing;
						return i += '<div class="transformContainer" style="-webkit-transform: ',
						h = c["if"].call(b, b.scale, {
								hash : {},
								inverse : j.noop,
								fn : j.program(1, f, e),
								data : e
							}),
						(h || 0 === h) && (i += h),
						i += ";\n-moz-transform: ",
						h = c["if"].call(b, b.scale, {
								hash : {},
								inverse : j.noop,
								fn : j.program(1, f, e),
								data : e
							}),
						(h || 0 === h) && (i += h),
						i += ";\ntransform: ",
						h = c["if"].call(b, b.scale, {
								hash : {},
								inverse : j.noop,
								fn : j.program(1, f, e),
								data : e
							}),
						(h || 0 === h) && (i += h),
						i += '">'
					}),
				this.JST["strut.presentation_generator.impress/Video"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var f,
						g = "",
						h = this,
						i = "function",
						j = this.escapeExpression;
						return f = h.invokePartial(d.ComponentContainer, "ComponentContainer", b, c, d, e),
						(f || 0 === f) && (g += f),
						g += '\n<video controls>\n	<source src="',
						(f = c.src) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.src, f = typeof f === i ? f.apply(b) : f),
						g += j(f) + '" type="',
						(f = c.srcType) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.srcType, f = typeof f === i ? f.apply(b) : f),
						g += j(f) + '" preload="metadata"></source>\n</video>\n</div>\n</div>'
					}),
				this.JST["strut.presentation_generator.impress/WebFrame"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var f,
						g = "",
						h = this,
						i = "function",
						j = this.escapeExpression;
						return f = h.invokePartial(d.ComponentContainer, "ComponentContainer", b, c, d, e),
						(f || 0 === f) && (g += f),
						g += '\n<iframe width="960" height="768" src="',
						(f = c.src) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.src, f = typeof f === i ? f.apply(b) : f),
						g += j(f) + '"></iframe>\n</div>\n</div>'
					}),
				this.JST["strut.presentation_generator.impress/Youtube"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var f,
						g,
						h = "",
						i = this,
						j = "function",
						k = this.escapeExpression;
						return f = i.invokePartial(d.SVGContainer, "SVGContainer", b, c, d, e),
						(f || 0 === f) && (h += f),
						h += '\n<object width="' + k((f = b.scale, f = null == f || f === !1 ? f : f.width, typeof f === j ? f.apply(b) : f)) + '" height="' + k((f = b.scale, f = null == f || f === !1 ? f : f.height, typeof f === j ? f.apply(b) : f)) + '"><param name="movie" value="http://www.youtube.com/v/',
						(g = c.shortSrc) ? g = g.call(b, {
								hash : {},
								data : e
							}) : (g = b.shortSrc, g = typeof g === j ? g.apply(b) : g),
						h += k(g) + '&hl=en&fs=1"><param name="allowFullScreen" value="true"><embed src="http://www.youtube.com/v/',
						(g = c.shortSrc) ? g = g.call(b, {
								hash : {},
								data : e
							}) : (g = b.shortSrc, g = typeof g === j ? g.apply(b) : g),
						h += k(g) + '&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="' + k((f = b.scale, f = null == f || f === !1 ? f : f.width, typeof f === j ? f.apply(b) : f)) + '" height="' + k((f = b.scale, f = null == f || f === !1 ? f : f.height, typeof f === j ? f.apply(b) : f)) + '"></object>\n</div>\n</div>'
					}),
				this.JST["strut.presentation_generator.impress/YoutubeContainer"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var f,
						g = "",
						h = "function",
						i = this.escapeExpression,
						j = this;
						return g += '<div class="componentContainer" style="top: ',
						(f = c.y) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.y, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + "px; left: ",
						(f = c.x) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.x, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + 'px;">\n',
						f = j.invokePartial(d.TransformContainer, "TransformContainer", b, c, d, e),
						(f || 0 === f) && (g += f),
						g
					}),
				this.JST["strut.presentation_generator.reveal/RevealTemplate"] = a.template(function (a, b, c, d, e) {
						function f(a, b, e) {
							var f,
							i,
							j,
							k = "";
							return k += '\n  <style type="text/css">\n    ',
							(f = c.customStylesheet) ? f = f.call(a, {
									hash : {},
									data : b
								}) : (f = a.customStylesheet, f = typeof f === o ? f.apply(a) : f),
							(f || 0 === f) && (k += f),
							k += "\n  </style>\n  ",
							f = q.invokePartial(d.PerSlideSurfaceStylesheet, "PerSlideSurfaceStylesheet", a, c, d, b),
							(f || 0 === f) && (k += f),
							k += '\n  \n    <div class="',
							j = {
								hash : {},
								inverse : q.noop,
								fn : q.program(2, g, b),
								data : b
							},
							f = c.isBGClass || a.isBGClass,
							i = f ? f.call(a, a.surface, j) : r.call(a, "isBGClass", a.surface, j),
							(i || 0 === i) && (k += i),
							k += 'reveal strut-surface">\n      <div class="bg innerBg">\n      <div class="slides">\n        ',
							f = a.slides,
							f = null == f || f === !1 ? f : f.models,
							f = typeof f === o ? f.apply(a) : f,
							i = s.call(a, f, {
									hash : {},
									inverse : q.noop,
									fn : q.programWithDepth(4, h, b, e),
									data : b
								}),
							(i || 0 === i) && (k += i),
							k += "\n      </div>\n      </div>\n    </div>\n"
						}
						function g(a, b) {
							var d,
							e = "";
							return (d = c.surface) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.surface, d = typeof d === o ? d.apply(a) : d),
							e += p(d) + " "
						}
						function h(a, b, d) {
							var e,
							f,
							g = "";
							return g += "\n        ",
							f = {
								hash : {},
								inverse : q.noop,
								fn : q.programWithDepth(5, i, b, a, d),
								data : b
							},
							(e = c.attributes) ? e = e.call(a, f) : (e = a.attributes, e = typeof e === o ? e.apply(a) : e),
							c.attributes || (e = s.call(a, e, f)),
							(e || 0 === e) && (g += e),
							g += "\n        "
						}
						function i(a, b, d, e) {
							var f,
							g,
							h,
							i = "";
							return i += '\n          <section class="',
							h = {
								hash : {},
								inverse : q.noop,
								fn : q.program(6, j, b),
								data : b
							},
							f = c.determineBG || d.determineBG,
							g = f ? f.call(a, d, e, h) : r.call(a, "determineBG", d, e, h),
							(g || 0 === g) && (i += g),
							i += " slideContainer strut-slide-",
							(g = c.index) ? g = g.call(a, {
									hash : {},
									data : b
								}) : (g = a.index, g = typeof g === o ? g.apply(a) : g),
							i += p(g) + '" style="width: 1024px; height: 768px;" data-state="strut-slide-',
							(g = c.index) ? g = g.call(a, {
									hash : {},
									data : b
								}) : (g = a.index, g = typeof g === o ? g.apply(a) : g),
							i += p(g),
							h = {
								hash : {},
								inverse : q.noop,
								fn : q.program(6, j, b),
								data : b
							},
							f = c.determineSurface || d.determineSurface,
							g = f ? f.call(a, d, e, h) : r.call(a, "determineSurface", d, e, h),
							(g || 0 === g) && (i += g),
							i += '">\n            <div class="themedArea">\n            ',
							h = {
								hash : {},
								inverse : q.noop,
								fn : q.program(6, j, b),
								data : b
							},
							f = c.marked || a.marked,
							g = f ? f.call(a, a.markdown, h) : r.call(a, "marked", a.markdown, h),
							(g || 0 === g) && (i += g),
							i += "\n            </div>\n            ",
							h = {
								hash : {},
								inverse : q.noop,
								fn : q.program(8, k, b),
								data : b
							},
							(g = c.components) ? g = g.call(a, h) : (g = a.components, g = typeof g === o ? g.apply(a) : g),
							c.components || (g = s.call(a, g, h)),
							(g || 0 === g) && (i += g),
							i += "\n          </section>\n        "
						}
						function j() {
							var a = "";
							return a
						}
						function k(a, b) {
							var d,
							e,
							f,
							g = "";
							return g += "\n              ",
							f = {
								hash : {},
								inverse : q.noop,
								fn : q.program(6, j, b),
								data : b
							},
							d = c.renderComponent || a.renderComponent,
							e = d ? d.call(a, a, f) : r.call(a, "renderComponent", a, f),
							(e || 0 === e) && (g += e),
							g += "\n            "
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						d = this.merge(d, a.partials),
						e = e || {};
						var l,
						m,
						n = "",
						o = "function",
						p = this.escapeExpression,
						q = this,
						r = c.helperMissing,
						s = c.blockHelperMissing;
						return m = {
							hash : {},
							inverse : q.noop,
							fn : q.programWithDepth(1, f, e, b),
							data : e
						},
						(l = c.attributes) ? l = l.call(b, m) : (l = b.attributes, l = typeof l === o ? l.apply(b) : l),
						c.attributes || (l = s.call(b, l, m)),
						(l || 0 === l) && (n += l),
						n += "\n"
					}),
				this.JST["strut.presentation_generator/Button"] = a.template(function (a, b, c, d, e) {
						function f(a, b) {
							var d,
							e = "";
							return e += '\n    <li data-option="',
							(d = c.id) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.id, d = typeof d === j ? d.apply(a) : d),
							e += k(d) + '"><a>\n    		<span class="check" style="visibility: hidden;">&#10003;</span>\n    		',
							(d = c.displayName) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.displayName, d = typeof d === j ? d.apply(a) : d),
							e += k(d) + "\n    </a></li>\n    "
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var g,
						h,
						i = "",
						j = "function",
						k = this.escapeExpression,
						l = this;
						return i += '<button class="btn btn-success act"><i class="icon-play icon-white"/><span class="chosen">' + k((g = b.chosen, g = null == g || g === !1 ? g : g.displayName, typeof g === j ? g.apply(b) : g)) + '</span></button>\n<button class="btn dropdown-toggle btn-success iconBtnsSplit" data-toggle="dropdown">\n  <span class="caret whiteCaret"></span>\n</button>\n<ul class="dropdown-menu">\n	',
						h = c.each.call(b, b.generators, {
								hash : {},
								inverse : l.noop,
								fn : l.program(1, f, e),
								data : e
							}),
						(h || 0 === h) && (i += h),
						i += "\n</ul>"
					}),
				this.JST["strut.presentation_generator/CustomBgStylesheet"] = a.template(function (a, b, c, d, e) {
						function f(a, b) {
							var d,
							e = "";
							return e += "\n	.",
							(d = c.klass) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.klass, d = typeof d === i ? d.apply(a) : d),
							e += j(d) + " {\n		background: ",
							(d = c.style) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.style, d = typeof d === i ? d.apply(a) : d),
							e += j(d) + ";\n	}\n"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var g,
						h,
						i = "function",
						j = this.escapeExpression,
						k = this,
						l = c.blockHelperMissing;
						return g = typeof b === i ? b.apply(b) : b,
						h = l.call(b, g, {
								hash : {},
								inverse : k.noop,
								fn : k.program(1, f, e),
								data : e
							}),
						h || 0 === h ? h : ""
					}),
				this.JST["strut.presentation_generator/PerSlideSurfaceStylesheet"] = a.template(function (a, b, c, d, e) {
						function f(a, b) {
							var d,
							e,
							f,
							h = "";
							return h += "\n	.strut-surface {\n		",
							f = {
								hash : {},
								inverse : q.noop,
								fn : q.program(2, g, b),
								data : b
							},
							d = c.getBGImgStyle || a.getBGImgStyle,
							e = d ? d.call(a, a.surface, f) : r.call(a, "getBGImgStyle", a.surface, f),
							(e || 0 === e) && (h += e),
							h += "\n	}\n"
						}
						function g() {
							var a = "";
							return a
						}
						function h(a, b) {
							var d,
							e,
							f,
							h = "";
							return h += "\n	.slideContainer {\n		",
							f = {
								hash : {},
								inverse : q.noop,
								fn : q.program(2, g, b),
								data : b
							},
							d = c.getBGImgStyle || a.getBGImgStyle,
							e = d ? d.call(a, a.background, f) : r.call(a, "getBGImgStyle", a.background, f),
							(e || 0 === e) && (h += e),
							h += "\n	}\n"
						}
						function i(a, b) {
							var d,
							e,
							f = "";
							return f += "\n	",
							e = {
								hash : {},
								inverse : q.noop,
								fn : q.program(7, j, b),
								data : b
							},
							(d = c.attributes) ? d = d.call(a, e) : (d = a.attributes, d = typeof d === s ? d.apply(a) : d),
							c.attributes || (d = u.call(a, d, e)),
							(d || 0 === d) && (f += d),
							f += "\n"
						}
						function j(a, b) {
							var d,
							e,
							f,
							g = "";
							return g += "\n		",
							f = {
								hash : {},
								inverse : q.noop,
								fn : q.program(8, k, b),
								data : b
							},
							d = c.isBGImg || a.isBGImg,
							e = d ? d.call(a, a.surface, f) : r.call(a, "isBGImg", a.surface, f),
							(e || 0 === e) && (g += e),
							g += "\n		",
							f = {
								hash : {},
								inverse : q.noop,
								fn : q.program(10, l, b),
								data : b
							},
							d = c.isBGImg || a.isBGImg,
							e = d ? d.call(a, a.background, f) : r.call(a, "isBGImg", a.background, f),
							(e || 0 === e) && (g += e),
							g += "\n	"
						}
						function k(a, b) {
							var d,
							e,
							f,
							h = "";
							return h += "\n		.strut-surface > .strut-slide-" + t((d = b, d = null == d || d === !1 ? d : d.index, typeof d === s ? d.apply(a) : d)) + " {\n			/*this only works for bg images or custom bgs*/\n			/*for bg classes we'll have to introduce a data api*/\n			",
							f = {
								hash : {},
								inverse : q.noop,
								fn : q.program(2, g, b),
								data : b
							},
							d = c.getBGImgStyle || a.getBGImgStyle,
							e = d ? d.call(a, a.surface, f) : r.call(a, "getBGImgStyle", a.surface, f),
							(e || 0 === e) && (h += e),
							h += "\n		}\n		"
						}
						function l(a, b) {
							var d,
							e,
							f,
							h = "";
							return h += "\n		.slideContainer.strut-slide-" + t((d = b, d = null == d || d === !1 ? d : d.index, typeof d === s ? d.apply(a) : d)) + " {\n			",
							f = {
								hash : {},
								inverse : q.noop,
								fn : q.program(2, g, b),
								data : b
							},
							d = c.getBGImgStyle || a.getBGImgStyle,
							e = d ? d.call(a, a.background, f) : r.call(a, "getBGImgStyle", a.background, f),
							(e || 0 === e) && (h += e),
							h += "\n		}\n		"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var m,
						n,
						o,
						p = "",
						q = this,
						r = c.helperMissing,
						s = "function",
						t = this.escapeExpression,
						u = c.blockHelperMissing;
						return p += "<style>\n",
						o = {
							hash : {},
							inverse : q.noop,
							fn : q.program(1, f, e),
							data : e
						},
						m = c.isBGImg || b.isBGImg,
						n = m ? m.call(b, b.surface, o) : r.call(b, "isBGImg", b.surface, o),
						(n || 0 === n) && (p += n),
						p += "\n",
						o = {
							hash : {},
							inverse : q.noop,
							fn : q.program(4, h, e),
							data : e
						},
						m = c.isBGImg || b.isBGImg,
						n = m ? m.call(b, b.background, o) : r.call(b, "isBGImg", b.background, o),
						(n || 0 === n) && (p += n),
						p += "\n",
						m = b.slides,
						m = null == m || m === !1 ? m : m.models,
						m = typeof m === s ? m.apply(b) : m,
						n = u.call(b, m, {
								hash : {},
								inverse : q.noop,
								fn : q.program(6, i, e),
								data : e
							}),
						(n || 0 === n) && (p += n),
						p += "\n</style>"
					}),
				this.JST["strut.slide_components/Component"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var f,
						g = "",
						h = "function",
						i = this.escapeExpression;
						return g += '<div class="content-scale">\n<div class="content"></div>\n</div>\n<span class="topLabel label"> \n	<span class="skewx" data-delta="skewX">↔</span>\n	<span class="align" data-option="x">↹</span>\n</span>\n<span class="leftLabel label"> \n	<span class="align" data-option="y">↹</span>\n	<span class="skewy" data-delta="skewY">↔</span>\n</span>\n<span class="rightLabel label rotate" data-delta="rotate">↻</span>\n<span class="scale label" data-delta="scale">↔</span>\n<span class="close-btn-red-20 removeBtn" title="Remove"></span>\n<div class="positioningCtrls form-inline">\n	<span class="label leftposition">→</span>\n	<input class="position" type="text" data-option="x" value="',
						(f = c.x) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.x, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"/>\n	<span class="label bottomposition">↑</span>\n	<input class="position" type="text" data-option="y" value="',
						(f = c.y) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.y, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"/>\n</div>\n'
					}),
				this.JST["strut.slide_components/ShapesDropdown"] = a.template(function (a, b, c, d, e) {
						function f() {
							var a = "";
							return a
						}
						function g(a, b) {
							var d,
							e = "";
							return e += '\n<li><a class="shape" data-src="',
							(d = c.src) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.src, d = typeof d === l ? d.apply(a) : d),
							e += m(d) + '"><img src="',
							(d = c.src) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.src, d = typeof d === l ? d.apply(a) : d),
							e += m(d) + '" width="100%" height="100%"></img></a></li>\n'
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var h,
						i,
						j,
						k = "",
						l = "function",
						m = this.escapeExpression,
						n = this,
						o = c.helperMissing,
						p = c.blockHelperMissing;
						return k += '<a class="btn btn-plast dropdown-toggle" data-toggle="dropdown">\n	<i class="icon-star icon-white"></i>\n	',
						j = {
							hash : {},
							inverse : n.noop,
							fn : n.program(1, f, e),
							data : e
						},
						h = c.lang || b.lang,
						i = h ? h.call(b, b.title, j) : o.call(b, "lang", b.title, j),
						(i || 0 === i) && (k += i),
						k += '</a>\n<ul class="dropdown-menu horizontalDropdown" role="menu" style="min-width: 127px; width: 127px">\n',
						j = {
							hash : {},
							inverse : n.noop,
							fn : n.program(3, g, e),
							data : e
						},
						(i = c.shapes) ? i = i.call(b, j) : (i = b.shapes, i = typeof i === l ? i.apply(b) : i),
						c.shapes || (i = p.call(b, i, j)),
						(i || 0 === i) && (k += i),
						k += "\n</ul>\n"
					}),
				this.JST["strut.slide_editor/Button"] = a.template(function (a, b, c, d, e) {
						function f() {
							var a = "";
							return a
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var g,
						h,
						i,
						j = "",
						k = this,
						l = c.helperMissing;
						return j += '<div class="btn-group iconBtns">\n	<a class="btn btn-plast">\n		<i class="icon-th-list icon-white"></i>\n		',
						i = {
							hash : {},
							inverse : k.noop,
							fn : k.program(1, f, e),
							data : e
						},
						g = c.lang || b.lang,
						h = g ? g.call(b, "slides", i) : l.call(b, "lang", "slides", i),
						(h || 0 === h) && (j += h),
						j += "\n	</a>\n</div>"
					}),
				this.JST["strut.slide_editor/Tablets"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						'<div class="tablets-content">\n</div>\n<div class="tablets-toggle btn btn-plast">\n	<span class="caret whiteCaret"></span>\n</div>'
					}),
				this.JST["strut.slide_snapshot/SlideDrawer"] = a.template(function (a, b, c, d, e) {
						function f() {
							var a = "";
							return a
						}
						function g(a, b) {
							var d,
							e,
							g,
							h = "";
							return h += "\n",
							g = {
								hash : {},
								inverse : l.noop,
								fn : l.program(1, f, b),
								data : b
							},
							d = c.renderComponent || a.renderComponent,
							e = d ? d.call(a, a, "Video WebFrame", g) : m.call(a, "renderComponent", a, "Video WebFrame", g),
							(e || 0 === e) && (h += e),
							h += "\n"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var h,
						i,
						j,
						k = "",
						l = this,
						m = c.helperMissing,
						n = "function",
						o = c.blockHelperMissing;
						return k += '<div class="themedArea">\n',
						j = {
							hash : {},
							inverse : l.noop,
							fn : l.program(1, f, e),
							data : e
						},
						h = c.marked || b.marked,
						i = h ? h.call(b, b.markdown, j) : m.call(b, "marked", b.markdown, j),
						(i || 0 === i) && (k += i),
						k += "\n</div>\n",
						j = {
							hash : {},
							inverse : l.noop,
							fn : l.program(3, g, e),
							data : e
						},
						(i = c.components) ? i = i.call(b, j) : (i = b.components, i = typeof i === n ? i.apply(b) : i),
						c.components || (i = o.call(b, i, j)),
						(i || 0 === i) && (k += i),
						k += "\n"
					}),
				this.JST["strut.slide_snapshot/SlideSnapshot"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						'<div class="overlay"></div>\n<div class="slideDrawer slideContainer"></div>\n<span class="close-btn-red-20 removeBtn" title="Remove"></span>\n<span class="badge badge-inverse"> </span>'
					}),
				this.JST["strut.slide_snapshot/TransitionSlideSnapshot"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var f,
						g = "",
						h = "function",
						i = this.escapeExpression;
						return g += '<div class="content-container">\n	<div class="content">\n		<div class="slideDrawer slideContainer"></div>\n		<div class="back"></div>\n		<div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div>\n	</div>\n</div>\n\n<div class="topLabel form-inline">\n	<span class="label rotates" data-delta="rotateY">↻Y</span>\n	<input type="text" data-option="rotateY" value="',
						(f = c.rotateY) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.rotateY, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"></input>\n</div>\n<div class="leftLabel form-inline">\n	<span class="label rotates" data-delta="rotateX">↻X</span>\n	<input type="text" data-option="rotateX" value="',
						(f = c.rotateX) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.rotateX, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"></input>\n</div>\n<div class="rightLabel form-inline">\n	<span class="label rotates" data-delta="rotateZ">↻Z</span>\n	<input type="text" data-option="rotateZ" value="',
						(f = c.rotateZ) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.rotateZ, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"></input>\n</div>\n<div class="positioningCtrls form-inline">\n	<span class="label layer">z</span>\n	<input class="position" type="text" data-option="z" value="',
						(f = c.z) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.z, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"/>\n	<span class="label scales">↔</span>\n	<input class="position" type="text" data-option="scale" value="',
						(f = c.impScale) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.impScale, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '"/>\n</div>\n<span class="badge badge-inverse"> </span>\n'
					}),
				this.JST["strut.splash/Splash"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						"<div></div>"
					}),
				this.JST["strut.storage/ProviderTab"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						"<div></div>"
					}),
				this.JST["strut.storage/StorageModal"] = a.template(function (a, b, c, d, e) {
						function f(a, b) {
							var d,
							e = "";
							return e += '\n			<li class="providerTab"><a data-provider="',
							(d = c.id) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.id, d = typeof d === j ? d.apply(a) : d),
							e += k(d) + '">',
							(d = c.name) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.name, d = typeof d === j ? d.apply(a) : d),
							e += k(d) + "</a></li>\n		"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var g,
						h,
						i = "",
						j = "function",
						k = this.escapeExpression,
						l = this,
						m = c.blockHelperMissing;
						return i += '<div class="modal-header">\n	<button class="close" data-dismiss="modal">×</button>\n	<h3 class="title">',
						(g = c.title) ? g = g.call(b, {
								hash : {},
								data : e
							}) : (g = b.title, g = typeof g === j ? g.apply(b) : g),
						i += k(g) + '</h3>\n</div>\n<div class="modal-body" style="overflow: hidden">\n	<ul class="nav nav-tabs">\n		',
						h = {
							hash : {},
							inverse : l.noop,
							fn : l.program(1, f, e),
							data : e
						},
						(g = c.tabs) ? g = g.call(b, h) : (g = b.tabs, g = typeof g === j ? g.apply(b) : g),
						c.tabs || (g = m.call(b, g, h)),
						(g || 0 === g) && (i += g),
						i += '\n	</ul>\n	<div class="tabContent">\n	</div>\n</div>\n<div class="modal-footer">\n	<a href="#" class="btn btn-primary ok btn-inverse">Ok</a>\n</div>'
					}),
				this.JST["strut.themes/BackgroundChooserDropdown"] = a.template(function (a, b, c, d, e) {
						function f() {
							var a = "";
							return a
						}
						function g(a, b) {
							var d,
							e = "";
							return e += '\n			<li><a class="',
							(d = c.klass) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.klass, d = typeof d === l ? d.apply(a) : d),
							e += m(d) + ' thumbnail" alt="',
							(d = c.description) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.description, d = typeof d === l ? d.apply(a) : d),
							e += m(d) + '" data-class="',
							(d = c.klass) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.klass, d = typeof d === l ? d.apply(a) : d),
							e += m(d) + '"></a></li>\n			'
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var h,
						i,
						j,
						k = "",
						l = "function",
						m = this.escapeExpression,
						n = this,
						o = c.helperMissing,
						p = c.blockHelperMissing;
						return k += '<a class="btn btn-plast dropdown-toggle" data-toggle="dropdown">\n	<i class="icon-tint icon-white"></i>\n	',
						j = {
							hash : {},
							inverse : n.noop,
							fn : n.program(1, f, e),
							data : e
						},
						h = c.lang || b.lang,
						i = h ? h.call(b, b.title, j) : o.call(b, "lang", b.title, j),
						(i || 0 === i) && (k += i),
						k += '</a>\n<ul class="dropdown-menu" role="menu">\n	<li class="dropdown-submenu">\n		<a tabindex="-1" href="#">All Slides</a>\n		<ul class="dropdown-menu horizontalDropdown allSlides" style="min-width: 127px; width: 127px">\n			',
						j = {
							hash : {},
							inverse : n.noop,
							fn : n.program(3, g, e),
							data : e
						},
						(i = c.backgrounds) ? i = i.call(b, j) : (i = b.backgrounds, i = typeof i === l ? i.apply(b) : i),
						c.backgrounds || (i = p.call(b, i, j)),
						(i || 0 === i) && (k += i),
						k += '\n			<li><a class="transparentPattern thumbnail" data-class="bg-transparent"></a></li>\n			<li><a class="bg-img thumbnail" data-class="bg-img"><i class="icon-picture"></i></a></li>\n			<li><a class="bg-custom thumbnail" data-class="bg-custom"><i class="icon-pencil"></i></a></li>\n		</ul>\n	</li>\n	<li class="dropdown-submenu">\n		<a tabindex="-1" href="#">Selected Slide</a>\n		<ul class="dropdown-menu horizontalDropdown" style="min-width: 127px; width: 127px">\n			',
						j = {
							hash : {},
							inverse : n.noop,
							fn : n.program(3, g, e),
							data : e
						},
						(i = c.backgrounds) ? i = i.call(b, j) : (i = b.backgrounds, i = typeof i === l ? i.apply(b) : i),
						c.backgrounds || (i = p.call(b, i, j)),
						(i || 0 === i) && (k += i),
						k += '\n			<li><a class="transparentPattern thumbnail" data-class="bg-transparent"></a></li>\n			<li><a class="nobg thumbnail" data-class="bg-default"></a></li>\n			<li><a class="bg-img thumbnail" data-class="bg-img"><i class="icon-picture"></i></a></li>\n			<li><a class="bg-custom thumbnail" data-class="bg-custom"><i class="icon-pencil"></i></a></li>\n		</ul>\n	</li>\n</ul>\n'
					}),
				this.JST["strut.themes/ColorChooserModal"] = a.template(function (a, b, c, d, e) {
						return this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {},
						'<div class="modal-header">\n	<button class="close" data-dismiss="modal">×</button>\n	<h3 class="title">Custom Color</h3>\n</div>\n<div class="modal-body" style="overflow: hidden">\n	<input type=\'text\' class="color-chooser pull-right" />\n</div>\n<div class="modal-footer">\n	<a href="#" class="btn btn-primary ok btn-inverse">Ok</a>\n</div>'
					}),
				this.JST["strut.themes/SurfaceChooserDropdown"] = a.template(function (a, b, c, d, e) {
						function f() {
							var a = "";
							return a
						}
						function g(a, b) {
							var d,
							e = "";
							return e += '\n			<li><a class="',
							(d = c.klass) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.klass, d = typeof d === l ? d.apply(a) : d),
							e += m(d) + ' thumbnail" alt="',
							(d = c.description) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.description, d = typeof d === l ? d.apply(a) : d),
							e += m(d) + '" data-class="',
							(d = c.klass) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.klass, d = typeof d === l ? d.apply(a) : d),
							e += m(d) + '"></a></li>\n			'
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var h,
						i,
						j,
						k = "",
						l = "function",
						m = this.escapeExpression,
						n = this,
						o = c.helperMissing,
						p = c.blockHelperMissing;
						return k += '<a class="btn btn-plast dropdown-toggle" data-toggle="dropdown">\n	<i class="icon-tint icon-white"></i>\n	',
						j = {
							hash : {},
							inverse : n.noop,
							fn : n.program(1, f, e),
							data : e
						},
						h = c.lang || b.lang,
						i = h ? h.call(b, b.title, j) : o.call(b, "lang", b.title, j),
						(i || 0 === i) && (k += i),
						k += '</a>\n<ul class="dropdown-menu" role="menu">\n	<li class="dropdown-submenu">\n		<a tabindex="-1" href="#">All Slides</a>\n		<ul class="dropdown-menu horizontalDropdown allSlides" style="min-width: 127px; width: 127px">\n			',
						j = {
							hash : {},
							inverse : n.noop,
							fn : n.program(3, g, e),
							data : e
						},
						(i = c.backgrounds) ? i = i.call(b, j) : (i = b.backgrounds, i = typeof i === l ? i.apply(b) : i),
						c.backgrounds || (i = p.call(b, i, j)),
						(i || 0 === i) && (k += i),
						k += '\n			<li><a class="nobg thumbnail" data-class="bg-default"></a></li>\n			<li><a class="bg-img thumbnail" data-class="bg-img"><i class="icon-picture"></i></a></li>\n			<li><a class="bg-custom thumbnail" data-class="bg-custom"><i class="icon-pencil"></i></a></li>\n		</ul>\n	</li>\n	<li class="dropdown-submenu">\n		<a tabindex="-1" href="#">Selected Slide</a>\n		<ul class="dropdown-menu horizontalDropdown" style="min-width: 127px; width: 127px">\n			',
						j = {
							hash : {},
							inverse : n.noop,
							fn : n.program(3, g, e),
							data : e
						},
						(i = c.backgrounds) ? i = i.call(b, j) : (i = b.backgrounds, i = typeof i === l ? i.apply(b) : i),
						c.backgrounds || (i = p.call(b, i, j)),
						(i || 0 === i) && (k += i),
						k += '\n			<li><a class="nobg thumbnail" data-class="bg-default"></a></li>\n			<li><a class="bg-img thumbnail" data-class="bg-img"><i class="icon-picture"></i></a></li>\n			<li><a class="bg-custom thumbnail" data-class="bg-custom"><i class="icon-pencil"></i></a></li>\n		</ul>\n	</li>\n</ul>\n'
					}),
				this.JST["strut.transition_editor/Button"] = a.template(function (a, b, c, d, e) {
						function f() {
							var a = "";
							return a
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var g,
						h,
						i,
						j = "",
						k = this,
						l = c.helperMissing;
						return j += '<div class="btn-group iconBtns">\n	<a class="btn btn-plast">\n		<i class="icon-th-large icon-white"></i>\n		',
						i = {
							hash : {},
							inverse : k.noop,
							fn : k.program(1, f, e),
							data : e
						},
						g = c.lang || b.lang,
						h = g ? g.call(b, "overview", i) : l.call(b, "lang", "overview", i),
						(h || 0 === h) && (j += h),
						j += "\n	</a>\n</div>"
					}),
				this.JST["strut.transition_editor/CannedTransitions"] = a.template(function (a, b, c, d, e) {
						function f(a, b) {
							var d,
							e = "";
							return e += '\n	<li class="span4">\n		<a href="#" data-name="',
							(d = c.name) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.name, d = typeof d === k ? d.apply(a) : d),
							e += l(d) + '" class="thumbnail',
							d = c["if"].call(a, a.active, {
									hash : {},
									inverse : m.noop,
									fn : m.program(2, g, b),
									data : b
								}),
							(d || 0 === d) && (e += d),
							e += '">\n			<img src="',
							(d = c.img) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.img, d = typeof d === k ? d.apply(a) : d),
							e += l(d) + '" style="',
							(d = c.style) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.style, d = typeof d === k ? d.apply(a) : d),
							e += l(d) + '"></img>\n		</a>\n	</li>\n	'
						}
						function g() {
							return " active"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var h,
						i,
						j = "",
						k = "function",
						l = this.escapeExpression,
						m = this,
						n = c.blockHelperMissing;
						return j += '<ul class="thumbnails">\n	',
						h = typeof b === k ? b.apply(b) : b,
						i = n.call(b, h, {
								hash : {},
								inverse : m.noop,
								fn : m.program(1, f, e),
								data : e
							}),
						(i || 0 === i) && (j += i),
						j += '\n</ul>\n<span class="bespoke-link">\n	<a href="https://github.com/markdalgleish/bespoke.js" target="_blank">Bespoke.js</a>\n</span>'
					}),
				this.JST["tantaman.web.widgets/CodeEditor"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var f,
						g = "",
						h = "function",
						i = this.escapeExpression;
						return g += '<div class="modal-header">\n	<button class="close" data-dismiss="modal">×</button>\n	<h3>',
						(f = c.title) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.title, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '</h3>\n</div>\n<div class="modal-body" style="overflow: hidden">\n	<textarea class="codeInput">',
						(f = c.placeholder) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.placeholder, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + '</textarea>\n</div>\n<div class="modal-footer">\n	<a href="#" class="btn btn-primary ok btn-inverse">Save</a>\n	<a href="#" class="btn btn-danger cancel">Cancel</a>\n</div>'
					}),
				this.JST["tantaman.web.widgets/FileBrowser"] = a.template(function (a, b, c, d, e) {
						function f(a) {
							var b = "";
							return b += '\n	<li data-fileName="' + k(typeof a === j ? a.apply(a) : a) + '"><a>' + k(typeof a === j ? a.apply(a) : a) + ' <button class="close pull-right">×</button></a></li>\n	'
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var g,
						h,
						i = "",
						j = "function",
						k = this.escapeExpression,
						l = this,
						m = c.blockHelperMissing;
						return i += '<input type="text" class="fileName"></input>\n<ul class="nav nav-pills nav-stacked">\n	',
						h = {
							hash : {},
							inverse : l.noop,
							fn : l.program(1, f, e),
							data : e
						},
						(g = c.files) ? g = g.call(b, h) : (g = b.files, g = typeof g === j ? g.apply(b) : g),
						c.files || (g = m.call(b, g, h)),
						(g || 0 === g) && (i += g),
						i += "\n</ul>"
					}),
				this.JST["tantaman.web.widgets/ItemImportModal"] = a.template(function (a, b, c, d, e) {
						function f() {
							return '<div data-option="browse" class="btn">Browse</div>\n	<p><em>*Local images are currently uploaded to imgur.<br/>We\'re working on changing this.</em></p>'
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var g,
						h,
						i = "",
						j = "function",
						k = this.escapeExpression,
						l = this,
						m = c.blockHelperMissing;
						return i += '<div class="modal-header">\n	<button class="close" data-dismiss="modal">×</button>\n	<h3>',
						(g = c.title) ? g = g.call(b, {
								hash : {},
								data : e
							}) : (g = b.title, g = typeof g === j ? g.apply(b) : g),
						i += k(g) + '</h3>\n</div>\n<div class="modal-body" style="overflow: hidden">\n	<div class="alert alert-error dispNone">\n  		<button class="close" data-dismiss="alert">×</button>\n  		The image URL you entered appears to be incorrect\n	</div>\n	<h4>URL:</h4><div class="form-inline"><input type="text" name="itemUrl"></input>&nbsp;',
						h = {
							hash : {},
							inverse : l.noop,
							fn : l.program(1, f, e),
							data : e
						},
						(g = c.browsable) ? g = g.call(b, h) : (g = b.browsable, g = typeof g === j ? g.apply(b) : g),
						c.browsable || (g = m.call(b, g, h)),
						(g || 0 === g) && (i += g),
						i += '</div>\n	<input type="file" style="display:none"></input>\n	<h4>Preview:</h4>\n	<ul class="thumbnails">\n		<li class="span4">\n			<div class="thumbnail">\n				<',
						(g = c.tag) ? g = g.call(b, {
								hash : {},
								data : e
							}) : (g = b.tag, g = typeof g === j ? g.apply(b) : g),
						i += k(g) + ' class="preview" width="360" height"268"></',
						(g = c.tag) ? g = g.call(b, {
								hash : {},
								data : e
							}) : (g = b.tag, g = typeof g === j ? g.apply(b) : g),
						i += k(g) + '>\n			</div>\n			<div class="progress active progress-striped dispNone">\n  				<div class="bar"></div>\n			</div>\n		</li>\n	</ul>\n</div>\n<div class="modal-footer">\n	<a href="#" class="btn btn-primary ok btn-inverse">',
						(g = c.title) ? g = g.call(b, {
								hash : {},
								data : e
							}) : (g = b.title, g = typeof g === j ? g.apply(b) : g),
						i += k(g) + "</a>\n</div>"
					}),
				this.JST["tantaman.web.widgets/PopoverTextbox"] = a.template(function (a, b, c, d, e) {
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var f,
						g = "",
						h = "function",
						i = this.escapeExpression;
						return (f = c.title) ? f = f.call(b, {
								hash : {},
								data : e
							}) : (f = b.title, f = typeof f === h ? f.apply(b) : f),
						g += i(f) + ' <input type="textbox" placeholder="custom1 custom2"></input>\n<div>\n<a class="btn btn-plast ok">Ok</a>\n<a class="btn btn-danger cancel">Cancel</a>\n</div>'
					}),
				this.JST["tantaman.web.widgets/TabbedModal"] = a.template(function (a, b, c, d, e) {
						function f(a, b) {
							var d,
							e = "";
							return e += '\n			<li class="providerTab" data-provider="',
							(d = c.id) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.id, d = typeof d === j ? d.apply(a) : d),
							e += k(d) + '"><a>',
							(d = c.name) ? d = d.call(a, {
									hash : {},
									data : b
								}) : (d = a.name, d = typeof d === j ? d.apply(a) : d),
							e += k(d) + "</a></li>\n		"
						}
						this.compilerInfo = [4, ">= 1.0.0"],
						c = this.merge(c, a.helpers),
						e = e || {};
						var g,
						h,
						i = "",
						j = "function",
						k = this.escapeExpression,
						l = this,
						m = c.blockHelperMissing;
						return i += '<div class="modal-header">\n	<button class="close" data-dismiss="modal">×</button>\n	<h3 class="title">',
						(g = c.title) ? g = g.call(b, {
								hash : {},
								data : e
							}) : (g = b.title, g = typeof g === j ? g.apply(b) : g),
						i += k(g) + '</h3>\n</div>\n<div class="modal-body" style="overflow: hidden">\n	<ul class="nav nav-tabs">\n		',
						g = typeof b === j ? b.apply(b) : b,
						h = m.call(b, g, {
								hash : {},
								inverse : l.noop,
								fn : l.program(1, f, e),
								data : e
							}),
						(h || 0 === h) && (i += h),
						i += '\n	</ul>\n	<div class="tabContent">\n	</div>\n</div>\n<div class="modal-footer">\n	<a href="#!" class="btn btn-primary ok btn-inverse">Ok</a>\n</div>'
					}),
				this.JST
			}), function (a, b) {
			function c(a) {
				var b = a.length,
				c = fb.type(a);
				return fb.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || "function" !== c && (0 === b || "number" == typeof b && b > 0 && b - 1 in a)
			}
			function d(a) {
				var b = ob[a] = {};
				return fb.each(a.match(hb) || [], function (a, c) {
					b[c] = !0
				}),
				b
			}
			function e() {
				Object.defineProperty(this.cache = {}, 0, {
					get : function () {
						return {}

					}
				}),
				this.expando = fb.expando + Math.random()
			}
			function f(a, c, d) {
				var e;
				if (d === b && 1 === a.nodeType)
					if (e = "data-" + c.replace(sb, "-$1").toLowerCase(), d = a.getAttribute(e), "string" == typeof d) {
						try {
							d = "true" === d ? !0 : "false" === d ? !1 : "null" === d ? null : +d + "" === d ? +d : rb.test(d) ? JSON.parse(d) : d
						} catch (f) {}

						pb.set(a, c, d)
					} else
						d = b;
				return d
			}
			function g() {
				return !0
			}
			function h() {
				return !1
			}
			function i() {
				try {
					return T.activeElement
				} catch (a) {}

			}
			function j(a, b) {
				for (; (a = a[b]) && 1 !== a.nodeType; );
				return a
			}
			function k(a, b, c) {
				if (fb.isFunction(b))
					return fb.grep(a, function (a, d) {
						return !!b.call(a, d, a) !== c
					});
				if (b.nodeType)
					return fb.grep(a, function (a) {
						return a === b !== c
					});
				if ("string" == typeof b) {
					if (Cb.test(b))
						return fb.filter(b, a, c);
					b = fb.filter(b, a)
				}
				return fb.grep(a, function (a) {
					return bb.call(b, a) >= 0 !== c
				})
			}
			function l(a, b) {
				return fb.nodeName(a, "table") && fb.nodeName(1 === b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
			}
			function m(a) {
				return a.type = (null !== a.getAttribute("type")) + "/" + a.type,
				a
			}
			function n(a) {
				var b = Nb.exec(a.type);
				return b ? a.type = b[1] : a.removeAttribute("type"),
				a
			}
			function o(a, b) {
				for (var c = a.length, d = 0; c > d; d++)
					qb.set(a[d], "globalEval", !b || qb.get(b[d], "globalEval"))
			}
			function p(a, b) {
				var c,
				d,
				e,
				f,
				g,
				h,
				i,
				j;
				if (1 === b.nodeType) {
					if (qb.hasData(a) && (f = qb.access(a), g = qb.set(b, f), j = f.events)) {
						delete g.handle,
						g.events = {};
						for (e in j)
							for (c = 0, d = j[e].length; d > c; c++)
								fb.event.add(b, e, j[e][c])
					}
					pb.hasData(a) && (h = pb.access(a), i = fb.extend({}, h), pb.set(b, i))
				}
			}
			function q(a, c) {
				var d = a.getElementsByTagName ? a.getElementsByTagName(c || "*") : a.querySelectorAll ? a.querySelectorAll(c || "*") : [];
				return c === b || c && fb.nodeName(a, c) ? fb.merge([a], d) : d
			}
			function r(a, b) {
				var c = b.nodeName.toLowerCase();
				"input" === c && Kb.test(a.type) ? b.checked = a.checked : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
			}
			function s(a, b) {
				if (b in a)
					return b;
				for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = _b.length; e--; )
					if (b = _b[e] + c, b in a)
						return b;
				return d
			}
			function t(a, b) {
				return a = b || a,
				"none" === fb.css(a, "display") || !fb.contains(a.ownerDocument, a)
			}
			function u(b) {
				return a.getComputedStyle(b, null)
			}
			function v(a, b) {
				for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
					d = a[g], d.style && (f[g] = qb.get(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && t(d) && (f[g] = qb.access(d, "olddisplay", z(d.nodeName)))) : f[g] || (e = t(d), (c && "none" !== c || !e) && qb.set(d, "olddisplay", e ? c : fb.css(d, "display"))));
				for (g = 0; h > g; g++)
					d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
				return a
			}
			function w(a, b, c) {
				var d = Ub.exec(b);
				return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
			}
			function x(a, b, c, d, e) {
				for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
					"margin" === c && (g += fb.css(a, c + $b[f], !0, e)), d ? ("content" === c && (g -= fb.css(a, "padding" + $b[f], !0, e)), "margin" !== c && (g -= fb.css(a, "border" + $b[f] + "Width", !0, e))) : (g += fb.css(a, "padding" + $b[f], !0, e), "padding" !== c && (g += fb.css(a, "border" + $b[f] + "Width", !0, e)));
				return g
			}
			function y(a, b, c) {
				var d = !0,
				e = "width" === b ? a.offsetWidth : a.offsetHeight,
				f = u(a),
				g = fb.support.boxSizing && "border-box" === fb.css(a, "boxSizing", !1, f);
				if (0 >= e || null == e) {
					if (e = Qb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Vb.test(e))
						return e;
					d = g && (fb.support.boxSizingReliable || e === a.style[b]),
					e = parseFloat(e) || 0
				}
				return e + x(a, b, c || (g ? "border" : "content"), d, f) + "px"
			}
			function z(a) {
				var b = T,
				c = Xb[a];
				return c || (c = A(a, b), "none" !== c && c || (Rb = (Rb || fb("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(b.documentElement), b = (Rb[0].contentWindow || Rb[0].contentDocument).document, b.write("<!doctype html><html><body>"), b.close(), c = A(a, b), Rb.detach()), Xb[a] = c),
				c
			}
			function A(a, b) {
				var c = fb(b.createElement(a)).appendTo(b.body),
				d = fb.css(c[0], "display");
				return c.remove(),
				d
			}
			function B(a, b, c, d) {
				var e;
				if (fb.isArray(b))
					fb.each(b, function (b, e) {
						c || bc.test(a) ? d(a, e) : B(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
					});
				else if (c || "object" !== fb.type(b))
					d(a, b);
				else
					for (e in b)
						B(a + "[" + e + "]", b[e], c, d)
			}
			function C(a) {
				return function (b, c) {
					"string" != typeof b && (c = b, b = "*");
					var d,
					e = 0,
					f = b.toLowerCase().match(hb) || [];
					if (fb.isFunction(c))
						for (; d = f[e++]; )
							"+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
				}
			}
			function D(a, b, c, d) {
				function e(h) {
					var i;
					return f[h] = !0,
					fb.each(a[h] || [], function (a, h) {
						var j = h(b, c, d);
						return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), e(j), !1)
					}),
					i
				}
				var f = {},
				g = a === sc;
				return e(b.dataTypes[0]) || !f["*"] && e("*")
			}
			function E(a, c) {
				var d,
				e,
				f = fb.ajaxSettings.flatOptions || {};
				for (d in c)
					c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
				return e && fb.extend(!0, a, e),
				a
			}
			function F(a, c, d) {
				for (var e, f, g, h, i = a.contents, j = a.dataTypes; "*" === j[0]; )
					j.shift(), e === b && (e = a.mimeType || c.getResponseHeader("Content-Type"));
				if (e)
					for (f in i)
						if (i[f] && i[f].test(e)) {
							j.unshift(f);
							break
						}
				if (j[0]in d)
					g = j[0];
				else {
					for (f in d) {
						if (!j[0] || a.converters[f + " " + j[0]]) {
							g = f;
							break
						}
						h || (h = f)
					}
					g = g || h
				}
				return g ? (g !== j[0] && j.unshift(g), d[g]) : void 0
			}
			function G(a, b, c, d) {
				var e,
				f,
				g,
				h,
				i,
				j = {},
				k = a.dataTypes.slice();
				if (k[1])
					for (g in a.converters)
						j[g.toLowerCase()] = a.converters[g];
				for (f = k.shift(); f; )
					if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
						if ("*" === f)
							f = i;
						else if ("*" !== i && i !== f) {
							if (g = j[i + " " + f] || j["* " + f], !g)
								for (e in j)
									if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
										g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
										break
									}
							if (g !== !0)
								if (g && a["throws"])
									b = g(b);
								else
									try {
										b = g(b)
									} catch (l) {
										return {
											state : "parsererror",
											error : g ? l : "No conversion from " + i + " to " + f
										}
									}
						}
				return {
					state : "success",
					data : b
				}
			}
			function H() {
				return setTimeout(function () {
					Bc = b
				}),
				Bc = fb.now()
			}
			function I(a, b, c) {
				for (var d, e = (Hc[b] || []).concat(Hc["*"]), f = 0, g = e.length; g > f; f++)
					if (d = e[f].call(c, b, a))
						return d
			}
			function J(a, b, c) {
				var d,
				e,
				f = 0,
				g = Gc.length,
				h = fb.Deferred().always(function () {
						delete i.elem
					}),
				i = function () {
					if (e)
						return !1;
					for (var b = Bc || H(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)
						j.tweens[g].run(f);
					return h.notifyWith(a, [j, f, c]),
					1 > f && i ? c : (h.resolveWith(a, [j]), !1)
				},
				j = h.promise({
						elem : a,
						props : fb.extend({}, b),
						opts : fb.extend(!0, {
							specialEasing : {}

						}, c),
						originalProperties : b,
						originalOptions : c,
						startTime : Bc || H(),
						duration : c.duration,
						tweens : [],
						createTween : function (b, c) {
							var d = fb.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
							return j.tweens.push(d),
							d
						},
						stop : function (b) {
							var c = 0,
							d = b ? j.tweens.length : 0;
							if (e)
								return this;
							for (e = !0; d > c; c++)
								j.tweens[c].run(1);
							return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]),
							this
						}
					}),
				k = j.props;
				for (K(k, j.opts.specialEasing); g > f; f++)
					if (d = Gc[f].call(j, a, k, j.opts))
						return d;
				return fb.map(k, I, j),
				fb.isFunction(j.opts.start) && j.opts.start.call(a, j),
				fb.fx.timer(fb.extend(i, {
						elem : a,
						anim : j,
						queue : j.opts.queue
					})),
				j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
			}
			function K(a, b) {
				var c,
				d,
				e,
				f,
				g;
				for (c in a)
					if (d = fb.camelCase(c), e = b[d], f = a[c], fb.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = fb.cssHooks[d], g && "expand" in g) {
						f = g.expand(f),
						delete a[d];
						for (c in f)
							c in a || (a[c] = f[c], b[c] = e)
					} else
						b[d] = e
			}
			function L(a, c, d) {
				var e,
				f,
				g,
				h,
				i,
				j,
				k = this,
				l = {},
				m = a.style,
				n = a.nodeType && t(a),
				o = qb.get(a, "fxshow");
				d.queue || (i = fb._queueHooks(a, "fx"), null == i.unqueued && (i.unqueued = 0, j = i.empty.fire, i.empty.fire = function () {
						i.unqueued || j()
					}), i.unqueued++, k.always(function () {
						k.always(function () {
							i.unqueued--,
							fb.queue(a, "fx").length || i.empty.fire()
						})
					})),
				1 === a.nodeType && ("height" in c || "width" in c) && (d.overflow = [m.overflow, m.overflowX, m.overflowY], "inline" === fb.css(a, "display") && "none" === fb.css(a, "float") && (m.display = "inline-block")),
				d.overflow && (m.overflow = "hidden", k.always(function () {
						m.overflow = d.overflow[0],
						m.overflowX = d.overflow[1],
						m.overflowY = d.overflow[2]
					}));
				for (e in c)
					if (f = c[e], Dc.exec(f)) {
						if (delete c[e], g = g || "toggle" === f, f === (n ? "hide" : "show")) {
							if ("show" !== f || !o || o[e] === b)
								continue;
							n = !0
						}
						l[e] = o && o[e] || fb.style(a, e)
					}
				if (!fb.isEmptyObject(l)) {
					o ? "hidden" in o && (n = o.hidden) : o = qb.access(a, "fxshow", {}),
					g && (o.hidden = !n),
					n ? fb(a).show() : k.done(function () {
						fb(a).hide()
					}),
					k.done(function () {
						var b;
						qb.remove(a, "fxshow");
						for (b in l)
							fb.style(a, b, l[b])
					});
					for (e in l)
						h = I(n ? o[e] : 0, e, k), e in o || (o[e] = h.start, n && (h.end = h.start, h.start = "width" === e || "height" === e ? 1 : 0))
				}
			}
			function M(a, b, c, d, e) {
				return new M.prototype.init(a, b, c, d, e)
			}
			function N(a, b) {
				var c,
				d = {
					height : a
				},
				e = 0;
				for (b = b ? 1 : 0; 4 > e; e += 2 - b)
					c = $b[e], d["margin" + c] = d["padding" + c] = a;
				return b && (d.opacity = d.width = a),
				d
			}
			function O(a) {
				return fb.isWindow(a) ? a : 9 === a.nodeType && a.defaultView
			}
			var P,
			Q,
			R = typeof b,
			S = a.location,
			T = a.document,
			U = T.documentElement,
			V = a.jQuery,
			W = a.$,
			X = {},
			Y = [],
			Z = "2.0.3",
			$ = Y.concat,
			_ = Y.push,
			ab = Y.slice,
			bb = Y.indexOf,
			cb = X.toString,
			db = X.hasOwnProperty,
			eb = Z.trim,
			fb = function (a, b) {
				return new fb.fn.init(a, b, P)
			},
			gb = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
			hb = /\S+/g,
			ib = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
			jb = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
			kb = /^-ms-/,
			lb = /-([\da-z])/gi,
			mb = function (a, b) {
				return b.toUpperCase()
			},
			nb = function () {
				T.removeEventListener("DOMContentLoaded", nb, !1),
				a.removeEventListener("load", nb, !1),
				fb.ready()
			};
			fb.fn = fb.prototype = {
				jquery : Z,
				constructor : fb,
				init : function (a, c, d) {
					var e,
					f;
					if (!a)
						return this;
					if ("string" == typeof a) {
						if (e = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : ib.exec(a), !e || !e[1] && c)
							return !c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a);
						if (e[1]) {
							if (c = c instanceof fb ? c[0] : c, fb.merge(this, fb.parseHTML(e[1], c && c.nodeType ? c.ownerDocument || c : T, !0)), jb.test(e[1]) && fb.isPlainObject(c))
								for (e in c)
									fb.isFunction(this[e]) ? this[e](c[e]) : this.attr(e, c[e]);
							return this
						}
						return f = T.getElementById(e[2]),
						f && f.parentNode && (this.length = 1, this[0] = f),
						this.context = T,
						this.selector = a,
						this
					}
					return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : fb.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), fb.makeArray(a, this))
				},
				selector : "",
				length : 0,
				toArray : function () {
					return ab.call(this)
				},
				get : function (a) {
					return null == a ? this.toArray() : 0 > a ? this[this.length + a] : this[a]
				},
				pushStack : function (a) {
					var b = fb.merge(this.constructor(), a);
					return b.prevObject = this,
					b.context = this.context,
					b
				},
				each : function (a, b) {
					return fb.each(this, a, b)
				},
				ready : function (a) {
					return fb.ready.promise().done(a),
					this
				},
				slice : function () {
					return this.pushStack(ab.apply(this, arguments))
				},
				first : function () {
					return this.eq(0)
				},
				last : function () {
					return this.eq(-1)
				},
				eq : function (a) {
					var b = this.length,
					c = +a + (0 > a ? b : 0);
					return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
				},
				map : function (a) {
					return this.pushStack(fb.map(this, function (b, c) {
							return a.call(b, c, b)
						}))
				},
				end : function () {
					return this.prevObject || this.constructor(null)
				},
				push : _,
				sort : [].sort,
				splice : [].splice
			},
			fb.fn.init.prototype = fb.fn,
			fb.extend = fb.fn.extend = function () {
				var a,
				c,
				d,
				e,
				f,
				g,
				h = arguments[0] || {},
				i = 1,
				j = arguments.length,
				k = !1;
				for ("boolean" == typeof h && (k = h, h = arguments[1] || {}, i = 2), "object" == typeof h || fb.isFunction(h) || (h = {}), j === i && (h = this, --i); j > i; i++)
					if (null != (a = arguments[i]))
						for (c in a)
							d = h[c], e = a[c], h !== e && (k && e && (fb.isPlainObject(e) || (f = fb.isArray(e))) ? (f ? (f = !1, g = d && fb.isArray(d) ? d : []) : g = d && fb.isPlainObject(d) ? d : {}, h[c] = fb.extend(k, g, e)) : e !== b && (h[c] = e));
				return h
			},
			fb.extend({
				expando : "jQuery" + (Z + Math.random()).replace(/\D/g, ""),
				noConflict : function (b) {
					return a.$ === fb && (a.$ = W),
					b && a.jQuery === fb && (a.jQuery = V),
					fb
				},
				isReady : !1,
				readyWait : 1,
				holdReady : function (a) {
					a ? fb.readyWait++ : fb.ready(!0)
				},
				ready : function (a) {
					(a === !0 ? --fb.readyWait : fb.isReady) || (fb.isReady = !0, a !== !0 && --fb.readyWait > 0 || (Q.resolveWith(T, [fb]), fb.fn.trigger && fb(T).trigger("ready").off("ready")))
				},
				isFunction : function (a) {
					return "function" === fb.type(a)
				},
				isArray : Array.isArray,
				isWindow : function (a) {
					return null != a && a === a.window
				},
				isNumeric : function (a) {
					return !isNaN(parseFloat(a)) && isFinite(a)
				},
				type : function (a) {
					return null == a ? String(a) : "object" == typeof a || "function" == typeof a ? X[cb.call(a)] || "object" : typeof a
				},
				isPlainObject : function (a) {
					if ("object" !== fb.type(a) || a.nodeType || fb.isWindow(a))
						return !1;
					try {
						if (a.constructor && !db.call(a.constructor.prototype, "isPrototypeOf"))
							return !1
					} catch (b) {
						return !1
					}
					return !0
				},
				isEmptyObject : function (a) {
					var b;
					for (b in a)
						return !1;
					return !0
				},
				error : function (a) {
					throw new Error(a)
				},
				parseHTML : function (a, b, c) {
					if (!a || "string" != typeof a)
						return null;
					"boolean" == typeof b && (c = b, b = !1),
					b = b || T;
					var d = jb.exec(a),
					e = !c && [];
					return d ? [b.createElement(d[1])] : (d = fb.buildFragment([a], b, e), e && fb(e).remove(), fb.merge([], d.childNodes))
				},
				parseJSON : JSON.parse,
				parseXML : function (a) {
					var c,
					d;
					if (!a || "string" != typeof a)
						return null;
					try {
						d = new DOMParser,
						c = d.parseFromString(a, "text/xml")
					} catch (e) {
						c = b
					}
					return (!c || c.getElementsByTagName("parsererror").length) && fb.error("Invalid XML: " + a),
					c
				},
				noop : function () {},
				globalEval : function (a) {
					var b,
					c = eval;
					a = fb.trim(a),
					a && (1 === a.indexOf("use strict") ? (b = T.createElement("script"), b.text = a, T.head.appendChild(b).parentNode.removeChild(b)) : c(a))
				},
				camelCase : function (a) {
					return a.replace(kb, "ms-").replace(lb, mb)
				},
				nodeName : function (a, b) {
					return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
				},
				each : function (a, b, d) {
					var e,
					f = 0,
					g = a.length,
					h = c(a);
					if (d) {
						if (h)
							for (; g > f && (e = b.apply(a[f], d), e !== !1); f++);
						else
							for (f in a)
								if (e = b.apply(a[f], d), e === !1)
									break
					} else if (h)
						for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++);
					else
						for (f in a)
							if (e = b.call(a[f], f, a[f]), e === !1)
								break;
					return a
				},
				trim : function (a) {
					return null == a ? "" : eb.call(a)
				},
				makeArray : function (a, b) {
					var d = b || [];
					return null != a && (c(Object(a)) ? fb.merge(d, "string" == typeof a ? [a] : a) : _.call(d, a)),
					d
				},
				inArray : function (a, b, c) {
					return null == b ? -1 : bb.call(b, a, c)
				},
				merge : function (a, c) {
					var d = c.length,
					e = a.length,
					f = 0;
					if ("number" == typeof d)
						for (; d > f; f++)
							a[e++] = c[f];
					else
						for (; c[f] !== b; )
							a[e++] = c[f++];
					return a.length = e,
					a
				},
				grep : function (a, b, c) {
					var d,
					e = [],
					f = 0,
					g = a.length;
					for (c = !!c; g > f; f++)
						d = !!b(a[f], f), c !== d && e.push(a[f]);
					return e
				},
				map : function (a, b, d) {
					var e,
					f = 0,
					g = a.length,
					h = c(a),
					i = [];
					if (h)
						for (; g > f; f++)
							e = b(a[f], f, d), null != e && (i[i.length] = e);
					else
						for (f in a)
							e = b(a[f], f, d), null != e && (i[i.length] = e);
					return $.apply([], i)
				},
				guid : 1,
				proxy : function (a, c) {
					var d,
					e,
					f;
					return "string" == typeof c && (d = a[c], c = a, a = d),
					fb.isFunction(a) ? (e = ab.call(arguments, 2), f = function () {
						return a.apply(c || this, e.concat(ab.call(arguments)))
					}, f.guid = a.guid = a.guid || fb.guid++, f) : b
				},
				access : function (a, c, d, e, f, g, h) {
					var i = 0,
					j = a.length,
					k = null == d;
					if ("object" === fb.type(d)) {
						f = !0;
						for (i in d)
							fb.access(a, c, i, d[i], !0, g, h)
					} else if (e !== b && (f = !0, fb.isFunction(e) || (h = !0), k && (h ? (c.call(a, e), c = null) : (k = c, c = function (a, b, c) {
									return k.call(fb(a), c)
								})), c))
						for (; j > i; i++)
							c(a[i], d, h ? e : e.call(a[i], i, c(a[i], d)));
					return f ? a : k ? c.call(a) : j ? c(a[0], d) : g
				},
				now : Date.now,
				swap : function (a, b, c, d) {
					var e,
					f,
					g = {};
					for (f in b)
						g[f] = a.style[f], a.style[f] = b[f];
					e = c.apply(a, d || []);
					for (f in b)
						a.style[f] = g[f];
					return e
				}
			}),
			fb.ready.promise = function (b) {
				return Q || (Q = fb.Deferred(), "complete" === T.readyState ? setTimeout(fb.ready) : (T.addEventListener("DOMContentLoaded", nb, !1), a.addEventListener("load", nb, !1))),
				Q.promise(b)
			},
			fb.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
				X["[object " + b + "]"] = b.toLowerCase()
			}),
			P = fb(T),
			function (a, b) {
				function c(a, b, c, d) {
					var e,
					f,
					g,
					h,
					i,
					j,
					k,
					l,
					o,
					p;
					if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], !a || "string" != typeof a)
						return c;
					if (1 !== (h = b.nodeType) && 9 !== h)
						return [];
					if (I && !d) {
						if (e = tb.exec(a))
							if (g = e[1]) {
								if (9 === h) {
									if (f = b.getElementById(g), !f || !f.parentNode)
										return c;
									if (f.id === g)
										return c.push(f), c
								} else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g)
									return c.push(f), c
							} else {
								if (e[2])
									return ab.apply(c, b.getElementsByTagName(a)), c;
								if ((g = e[3]) && x.getElementsByClassName && b.getElementsByClassName)
									return ab.apply(c, b.getElementsByClassName(g)), c
							}
						if (x.qsa && (!J || !J.test(a))) {
							if (l = k = N, o = b, p = 9 === h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
								for (j = m(a), (k = b.getAttribute("id")) ? l = k.replace(wb, "\\$&") : b.setAttribute("id", l), l = "[id='" + l + "'] ", i = j.length; i--; )
									j[i] = l + n(j[i]);
								o = nb.test(a) && b.parentNode || b,
								p = j.join(",")
							}
							if (p)
								try {
									return ab.apply(c, o.querySelectorAll(p)),
									c
								} catch (q) {}

							finally {
								k || b.removeAttribute("id")
							}
						}
					}
					return v(a.replace(kb, "$1"), b, c, d)
				}
				function d() {
					function a(c, d) {
						return b.push(c += " ") > z.cacheLength && delete a[b.shift()],
						a[c] = d
					}
					var b = [];
					return a
				}
				function e(a) {
					return a[N] = !0,
					a
				}
				function f(a) {
					var b = G.createElement("div");
					try {
						return !!a(b)
					} catch (c) {
						return !1
					}
					finally {
						b.parentNode && b.parentNode.removeChild(b),
						b = null
					}
				}
				function g(a, b) {
					for (var c = a.split("|"), d = a.length; d--; )
						z.attrHandle[c[d]] = b
				}
				function h(a, b) {
					var c = b && a,
					d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || X) - (~a.sourceIndex || X);
					if (d)
						return d;
					if (c)
						for (; c = c.nextSibling; )
							if (c === b)
								return -1;
					return a ? 1 : -1
				}
				function i(a) {
					return function (b) {
						var c = b.nodeName.toLowerCase();
						return "input" === c && b.type === a
					}
				}
				function j(a) {
					return function (b) {
						var c = b.nodeName.toLowerCase();
						return ("input" === c || "button" === c) && b.type === a
					}
				}
				function k(a) {
					return e(function (b) {
						return b = +b,
						e(function (c, d) {
							for (var e, f = a([], c.length, b), g = f.length; g--; )
								c[e = f[g]] && (c[e] = !(d[e] = c[e]))
						})
					})
				}
				function l() {}

				function m(a, b) {
					var d,
					e,
					f,
					g,
					h,
					i,
					j,
					k = S[a + " "];
					if (k)
						return b ? 0 : k.slice(0);
					for (h = a, i = [], j = z.preFilter; h; ) {
						(!d || (e = lb.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])),
						d = !1,
						(e = mb.exec(h)) && (d = e.shift(), f.push({
								value : d,
								type : e[0].replace(kb, " ")
							}), h = h.slice(d.length));
						for (g in z.filter)
							!(e = rb[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
									value : d,
									type : g,
									matches : e
								}), h = h.slice(d.length));
						if (!d)
							break
					}
					return b ? h.length : h ? c.error(a) : S(a, i).slice(0)
				}
				function n(a) {
					for (var b = 0, c = a.length, d = ""; c > b; b++)
						d += a[b].value;
					return d
				}
				function o(a, b, c) {
					var d = b.dir,
					e = c && "parentNode" === d,
					f = Q++;
					return b.first ? function (b, c, f) {
						for (; b = b[d]; )
							if (1 === b.nodeType || e)
								return a(b, c, f)
					}
					 : function (b, c, g) {
						var h,
						i,
						j,
						k = P + " " + f;
						if (g) {
							for (; b = b[d]; )
								if ((1 === b.nodeType || e) && a(b, c, g))
									return !0
						} else
							for (; b = b[d]; )
								if (1 === b.nodeType || e)
									if (j = b[N] || (b[N] = {}), (i = j[d]) && i[0] === k) {
										if ((h = i[1]) === !0 || h === y)
											return h === !0
									} else if (i = j[d] = [k], i[1] = a(b, c, g) || y, i[1] === !0)
										return !0
					}
				}
				function p(a) {
					return a.length > 1 ? function (b, c, d) {
						for (var e = a.length; e--; )
							if (!a[e](b, c, d))
								return !1;
						return !0
					}
					 : a[0]
				}
				function q(a, b, c, d, e) {
					for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
						(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
					return g
				}
				function r(a, b, c, d, f, g) {
					return d && !d[N] && (d = r(d)),
					f && !f[N] && (f = r(f, g)),
					e(function (e, g, h, i) {
						var j,
						k,
						l,
						m = [],
						n = [],
						o = g.length,
						p = e || u(b || "*", h.nodeType ? [h] : h, []),
						r = !a || !e && b ? p : q(p, m, a, h, i),
						s = c ? f || (e ? a : o || d) ? [] : g : r;
						if (c && c(r, s, h, i), d)
							for (j = q(s, n), d(j, [], h, i), k = j.length; k--; )
								(l = j[k]) && (s[n[k]] = !(r[n[k]] = l));
						if (e) {
							if (f || a) {
								if (f) {
									for (j = [], k = s.length; k--; )
										(l = s[k]) && j.push(r[k] = l);
									f(null, s = [], j, i)
								}
								for (k = s.length; k--; )
									(l = s[k]) && (j = f ? cb.call(e, l) : m[k]) > -1 && (e[j] = !(g[j] = l))
							}
						} else
							s = q(s === g ? s.splice(o, s.length) : s), f ? f(null, g, s, i) : ab.apply(g, s)
					})
				}
				function s(a) {
					for (var b, c, d, e = a.length, f = z.relative[a[0].type], g = f || z.relative[" "], h = f ? 1 : 0, i = o(function (a) {
								return a === b
							}, g, !0), j = o(function (a) {
								return cb.call(b, a) > -1
							}, g, !0), k = [function (a, c, d) {
								return !f && (d || c !== D) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d))
							}
						]; e > h; h++)
						if (c = z.relative[a[h].type])
							k = [o(p(k), c)];
						else {
							if (c = z.filter[a[h].type].apply(null, a[h].matches), c[N]) {
								for (d = ++h; e > d && !z.relative[a[d].type]; d++);
								return r(h > 1 && p(k), h > 1 && n(a.slice(0, h - 1).concat({
											value : " " === a[h - 2].type ? "*" : ""
										})).replace(kb, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && n(a))
							}
							k.push(c)
						}
					return p(k)
				}
				function t(a, b) {
					var d = 0,
					f = b.length > 0,
					g = a.length > 0,
					h = function (e, h, i, j, k) {
						var l,
						m,
						n,
						o = [],
						p = 0,
						r = "0",
						s = e && [],
						t = null != k,
						u = D,
						v = e || g && z.find.TAG("*", k && h.parentNode || h),
						w = P += null == u ? 1 : Math.random() || .1;
						for (t && (D = h !== G && h, y = d); null != (l = v[r]); r++) {
							if (g && l) {
								for (m = 0; n = a[m++]; )
									if (n(l, h, i)) {
										j.push(l);
										break
									}
								t && (P = w, y = ++d)
							}
							f && ((l = !n && l) && p--, e && s.push(l))
						}
						if (p += r, f && r !== p) {
							for (m = 0; n = b[m++]; )
								n(s, o, h, i);
							if (e) {
								if (p > 0)
									for (; r--; )
										s[r] || o[r] || (o[r] = $.call(j));
								o = q(o)
							}
							ab.apply(j, o),
							t && !e && o.length > 0 && p + b.length > 1 && c.uniqueSort(j)
						}
						return t && (P = w, D = u),
						s
					};
					return f ? e(h) : h
				}
				function u(a, b, d) {
					for (var e = 0, f = b.length; f > e; e++)
						c(a, b[e], d);
					return d
				}
				function v(a, b, c, d) {
					var e,
					f,
					g,
					h,
					i,
					j = m(a);
					if (!d && 1 === j.length) {
						if (f = j[0] = j[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && x.getById && 9 === b.nodeType && I && z.relative[f[1].type]) {
							if (b = (z.find.ID(g.matches[0].replace(xb, yb), b) || [])[0], !b)
								return c;
							a = a.slice(f.shift().value.length)
						}
						for (e = rb.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !z.relative[h = g.type]); )
							if ((i = z.find[h]) && (d = i(g.matches[0].replace(xb, yb), nb.test(f[0].type) && b.parentNode || b))) {
								if (f.splice(e, 1), a = d.length && n(f), !a)
									return ab.apply(c, d), c;
								break
							}
					}
					return C(a, j)(d, b, !I, c, nb.test(a)),
					c
				}
				var w,
				x,
				y,
				z,
				A,
				B,
				C,
				D,
				E,
				F,
				G,
				H,
				I,
				J,
				K,
				L,
				M,
				N = "sizzle" + -new Date,
				O = a.document,
				P = 0,
				Q = 0,
				R = d(),
				S = d(),
				T = d(),
				U = !1,
				V = function (a, b) {
					return a === b ? (U = !0, 0) : 0
				},
				W = typeof b,
				X = 1 << 31,
				Y = {}

				.hasOwnProperty,
				Z = [],
				$ = Z.pop,
				_ = Z.push,
				ab = Z.push,
				bb = Z.slice,
				cb = Z.indexOf || function (a) {
					for (var b = 0, c = this.length; c > b; b++)
						if (this[b] === a)
							return b;
					return -1
				},
				db = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
				eb = "[\\x20\\t\\r\\n\\f]",
				gb = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
				hb = gb.replace("w", "w#"),
				ib = "\\[" + eb + "*(" + gb + ")" + eb + "*(?:([*^$|!~]?=)" + eb + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + hb + ")|)|)" + eb + "*\\]",
				jb = ":(" + gb + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + ib.replace(3, 8) + ")*)|.*)\\)|)",
				kb = new RegExp("^" + eb + "+|((?:^|[^\\\\])(?:\\\\.)*)" + eb + "+$", "g"),
				lb = new RegExp("^" + eb + "*," + eb + "*"),
				mb = new RegExp("^" + eb + "*([>+~]|" + eb + ")" + eb + "*"),
				nb = new RegExp(eb + "*[+~]"),
				ob = new RegExp("=" + eb + "*([^\\]'\"]*)" + eb + "*\\]", "g"),
				pb = new RegExp(jb),
				qb = new RegExp("^" + hb + "$"),
				rb = {
					ID : new RegExp("^#(" + gb + ")"),
					CLASS : new RegExp("^\\.(" + gb + ")"),
					TAG : new RegExp("^(" + gb.replace("w", "w*") + ")"),
					ATTR : new RegExp("^" + ib),
					PSEUDO : new RegExp("^" + jb),
					CHILD : new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + eb + "*(even|odd|(([+-]|)(\\d*)n|)" + eb + "*(?:([+-]|)" + eb + "*(\\d+)|))" + eb + "*\\)|)", "i"),
					bool : new RegExp("^(?:" + db + ")$", "i"),
					needsContext : new RegExp("^" + eb + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + eb + "*((?:-\\d)?\\d*)" + eb + "*\\)|)(?=[^-]|$)", "i")
				},
				sb = /^[^{]+\{\s*\[native \w/,
				tb = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
				ub = /^(?:input|select|textarea|button)$/i,
				vb = /^h\d$/i,
				wb = /'|\\/g,
				xb = new RegExp("\\\\([\\da-f]{1,6}" + eb + "?|(" + eb + ")|.)", "ig"),
				yb = function (a, b, c) {
					var d = "0x" + b - 65536;
					return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(55296 | d >> 10, 56320 | 1023 & d)
				};
				try {
					ab.apply(Z = bb.call(O.childNodes), O.childNodes),
					Z[O.childNodes.length].nodeType
				} catch (zb) {
					ab = {
						apply : Z.length ? function (a, b) {
							_.apply(a, bb.call(b))
						}
						 : function (a, b) {
							for (var c = a.length, d = 0; a[c++] = b[d++]; );
							a.length = c - 1
						}
					}
				}
				B = c.isXML = function (a) {
					var b = a && (a.ownerDocument || a).documentElement;
					return b ? "HTML" !== b.nodeName : !1
				},
				x = c.support = {},
				F = c.setDocument = function (a) {
					var b = a ? a.ownerDocument || a : O,
					c = b.defaultView;
					return b !== G && 9 === b.nodeType && b.documentElement ? (G = b, H = b.documentElement, I = !B(b), c && c.attachEvent && c !== c.top && c.attachEvent("onbeforeunload", function () {
							F()
						}), x.attributes = f(function (a) {
								return a.className = "i",
								!a.getAttribute("className")
							}), x.getElementsByTagName = f(function (a) {
								return a.appendChild(b.createComment("")),
								!a.getElementsByTagName("*").length
							}), x.getElementsByClassName = f(function (a) {
								return a.innerHTML = "<div class='a'></div><div class='a i'></div>",
								a.firstChild.className = "i",
								2 === a.getElementsByClassName("i").length
							}), x.getById = f(function (a) {
								return H.appendChild(a).id = N,
								!b.getElementsByName || !b.getElementsByName(N).length
							}), x.getById ? (z.find.ID = function (a, b) {
							if (typeof b.getElementById !== W && I) {
								var c = b.getElementById(a);
								return c && c.parentNode ? [c] : []
							}
						}, z.filter.ID = function (a) {
							var b = a.replace(xb, yb);
							return function (a) {
								return a.getAttribute("id") === b
							}
						}) : (delete z.find.ID, z.filter.ID = function (a) {
							var b = a.replace(xb, yb);
							return function (a) {
								var c = typeof a.getAttributeNode !== W && a.getAttributeNode("id");
								return c && c.value === b
							}
						}), z.find.TAG = x.getElementsByTagName ? function (a, b) {
						return typeof b.getElementsByTagName !== W ? b.getElementsByTagName(a) : void 0
					}
						 : function (a, b) {
						var c,
						d = [],
						e = 0,
						f = b.getElementsByTagName(a);
						if ("*" === a) {
							for (; c = f[e++]; )
								1 === c.nodeType && d.push(c);
							return d
						}
						return f
					}, z.find.CLASS = x.getElementsByClassName && function (a, b) {
						return typeof b.getElementsByClassName !== W && I ? b.getElementsByClassName(a) : void 0
					}, K = [], J = [], (x.qsa = sb.test(b.querySelectorAll)) && (f(function (a) {
								a.innerHTML = "<select><option selected=''></option></select>",
								a.querySelectorAll("[selected]").length || J.push("\\[" + eb + "*(?:value|" + db + ")"),
								a.querySelectorAll(":checked").length || J.push(":checked")
							}), f(function (a) {
								var c = b.createElement("input");
								c.setAttribute("type", "hidden"),
								a.appendChild(c).setAttribute("t", ""),
								a.querySelectorAll("[t^='']").length && J.push("[*^$]=" + eb + "*(?:''|\"\")"),
								a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"),
								a.querySelectorAll("*,:x"),
								J.push(",.*:")
							})), (x.matchesSelector = sb.test(L = H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && f(function (a) {
							x.disconnectedMatch = L.call(a, "div"),
							L.call(a, "[s!='']:x"),
							K.push("!=", jb)
						}), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), M = sb.test(H.contains) || H.compareDocumentPosition ? function (a, b) {
						var c = 9 === a.nodeType ? a.documentElement : a,
						d = b && b.parentNode;
						return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
					}
						 : function (a, b) {
						if (b)
							for (; b = b.parentNode; )
								if (b === a)
									return !0;
						return !1
					}, V = H.compareDocumentPosition ? function (a, c) {
						if (a === c)
							return U = !0, 0;
						var d = c.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(c);
						return d ? 1 & d || !x.sortDetached && c.compareDocumentPosition(a) === d ? a === b || M(O, a) ? -1 : c === b || M(O, c) ? 1 : E ? cb.call(E, a) - cb.call(E, c) : 0 : 4 & d ? -1 : 1 : a.compareDocumentPosition ? -1 : 1
					}
						 : function (a, c) {
						var d,
						e = 0,
						f = a.parentNode,
						g = c.parentNode,
						i = [a],
						j = [c];
						if (a === c)
							return U = !0, 0;
						if (!f || !g)
							return a === b ? -1 : c === b ? 1 : f ? -1 : g ? 1 : E ? cb.call(E, a) - cb.call(E, c) : 0;
						if (f === g)
							return h(a, c);
						for (d = a; d = d.parentNode; )
							i.unshift(d);
						for (d = c; d = d.parentNode; )
							j.unshift(d);
						for (; i[e] === j[e]; )
							e++;
						return e ? h(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
					}, b) : G
				},
				c.matches = function (a, b) {
					return c(a, null, null, b)
				},
				c.matchesSelector = function (a, b) {
					if ((a.ownerDocument || a) !== G && F(a), b = b.replace(ob, "='$1']"), !(!x.matchesSelector || !I || K && K.test(b) || J && J.test(b)))
						try {
							var d = L.call(a, b);
							if (d || x.disconnectedMatch || a.document && 11 !== a.document.nodeType)
								return d
						} catch (e) {}

					return c(b, G, null, [a]).length > 0
				},
				c.contains = function (a, b) {
					return (a.ownerDocument || a) !== G && F(a),
					M(a, b)
				},
				c.attr = function (a, c) {
					(a.ownerDocument || a) !== G && F(a);
					var d = z.attrHandle[c.toLowerCase()],
					e = d && Y.call(z.attrHandle, c.toLowerCase()) ? d(a, c, !I) : b;
					return e === b ? x.attributes || !I ? a.getAttribute(c) : (e = a.getAttributeNode(c)) && e.specified ? e.value : null : e
				},
				c.error = function (a) {
					throw new Error("Syntax error, unrecognized expression: " + a)
				},
				c.uniqueSort = function (a) {
					var b,
					c = [],
					d = 0,
					e = 0;
					if (U = !x.detectDuplicates, E = !x.sortStable && a.slice(0), a.sort(V), U) {
						for (; b = a[e++]; )
							b === a[e] && (d = c.push(e));
						for (; d--; )
							a.splice(c[d], 1)
					}
					return a
				},
				A = c.getText = function (a) {
					var b,
					c = "",
					d = 0,
					e = a.nodeType;
					if (e) {
						if (1 === e || 9 === e || 11 === e) {
							if ("string" == typeof a.textContent)
								return a.textContent;
							for (a = a.firstChild; a; a = a.nextSibling)
								c += A(a)
						} else if (3 === e || 4 === e)
							return a.nodeValue
					} else
						for (; b = a[d]; d++)
							c += A(b);
					return c
				},
				z = c.selectors = {
					cacheLength : 50,
					createPseudo : e,
					match : rb,
					attrHandle : {},
					find : {},
					relative : {
						">" : {
							dir : "parentNode",
							first : !0
						},
						" " : {
							dir : "parentNode"
						},
						"+" : {
							dir : "previousSibling",
							first : !0
						},
						"~" : {
							dir : "previousSibling"
						}
					},
					preFilter : {
						ATTR : function (a) {
							return a[1] = a[1].replace(xb, yb),
							a[3] = (a[4] || a[5] || "").replace(xb, yb),
							"~=" === a[2] && (a[3] = " " + a[3] + " "),
							a.slice(0, 4)
						},
						CHILD : function (a) {
							return a[1] = a[1].toLowerCase(),
							"nth" === a[1].slice(0, 3) ? (a[3] || c.error(a[0]), a[4] =  + (a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] =  + (a[7] + a[8] || "odd" === a[3])) : a[3] && c.error(a[0]),
							a
						},
						PSEUDO : function (a) {
							var c,
							d = !a[5] && a[2];
							return rb.CHILD.test(a[0]) ? null : (a[3] && a[4] !== b ? a[2] = a[4] : d && pb.test(d) && (c = m(d, !0)) && (c = d.indexOf(")", d.length - c) - d.length) && (a[0] = a[0].slice(0, c), a[2] = d.slice(0, c)), a.slice(0, 3))
						}
					},
					filter : {
						TAG : function (a) {
							var b = a.replace(xb, yb).toLowerCase();
							return "*" === a ? function () {
								return !0
							}
							 : function (a) {
								return a.nodeName && a.nodeName.toLowerCase() === b
							}
						},
						CLASS : function (a) {
							var b = R[a + " "];
							return b || (b = new RegExp("(^|" + eb + ")" + a + "(" + eb + "|$)")) && R(a, function (a) {
								return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== W && a.getAttribute("class") || "")
							})
						},
						ATTR : function (a, b, d) {
							return function (e) {
								var f = c.attr(e, a);
								return null == f ? "!=" === b : b ? (f += "", "=" === b ? f === d : "!=" === b ? f !== d : "^=" === b ? d && 0 === f.indexOf(d) : "*=" === b ? d && f.indexOf(d) > -1 : "$=" === b ? d && f.slice(-d.length) === d : "~=" === b ? (" " + f + " ").indexOf(d) > -1 : "|=" === b ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0
							}
						},
						CHILD : function (a, b, c, d, e) {
							var f = "nth" !== a.slice(0, 3),
							g = "last" !== a.slice(-4),
							h = "of-type" === b;
							return 1 === d && 0 === e ? function (a) {
								return !!a.parentNode
							}
							 : function (b, c, i) {
								var j,
								k,
								l,
								m,
								n,
								o,
								p = f !== g ? "nextSibling" : "previousSibling",
								q = b.parentNode,
								r = h && b.nodeName.toLowerCase(),
								s = !i && !h;
								if (q) {
									if (f) {
										for (; p; ) {
											for (l = b; l = l[p]; )
												if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)
													return !1;
											o = p = "only" === a && !o && "nextSibling"
										}
										return !0
									}
									if (o = [g ? q.firstChild : q.lastChild], g && s) {
										for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop(); )
											if (1 === l.nodeType && ++m && l === b) {
												k[a] = [P, n, m];
												break
											}
									} else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P)
										m = j[1];
									else
										for (; (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b)); );
									return m -= e,
									m === d || 0 === m % d && m / d >= 0
								}
							}
						},
						PSEUDO : function (a, b) {
							var d,
							f = z.pseudos[a] || z.setFilters[a.toLowerCase()] || c.error("unsupported pseudo: " + a);
							return f[N] ? f(b) : f.length > 1 ? (d = [a, a, "", b], z.setFilters.hasOwnProperty(a.toLowerCase()) ? e(function (a, c) {
									for (var d, e = f(a, b), g = e.length; g--; )
										d = cb.call(a, e[g]), a[d] = !(c[d] = e[g])
								}) : function (a) {
								return f(a, 0, d)
							}) : f
						}
					},
					pseudos : {
						not : e(function (a) {
							var b = [],
							c = [],
							d = C(a.replace(kb, "$1"));
							return d[N] ? e(function (a, b, c, e) {
								for (var f, g = d(a, null, e, []), h = a.length; h--; )
									(f = g[h]) && (a[h] = !(b[h] = f))
							}) : function (a, e, f) {
								return b[0] = a,
								d(b, null, f, c),
								!c.pop()
							}
						}),
						has : e(function (a) {
							return function (b) {
								return c(a, b).length > 0
							}
						}),
						contains : e(function (a) {
							return function (b) {
								return (b.textContent || b.innerText || A(b)).indexOf(a) > -1
							}
						}),
						lang : e(function (a) {
							return qb.test(a || "") || c.error("unsupported lang: " + a),
							a = a.replace(xb, yb).toLowerCase(),
							function (b) {
								var c;
								do
									if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
										return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
								while ((b = b.parentNode) && 1 === b.nodeType);
								return !1
							}
						}),
						target : function (b) {
							var c = a.location && a.location.hash;
							return c && c.slice(1) === b.id
						},
						root : function (a) {
							return a === H
						},
						focus : function (a) {
							return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
						},
						enabled : function (a) {
							return a.disabled === !1
						},
						disabled : function (a) {
							return a.disabled === !0
						},
						checked : function (a) {
							var b = a.nodeName.toLowerCase();
							return "input" === b && !!a.checked || "option" === b && !!a.selected
						},
						selected : function (a) {
							return a.parentNode && a.parentNode.selectedIndex,
							a.selected === !0
						},
						empty : function (a) {
							for (a = a.firstChild; a; a = a.nextSibling)
								if (a.nodeName > "@" || 3 === a.nodeType || 4 === a.nodeType)
									return !1;
							return !0
						},
						parent : function (a) {
							return !z.pseudos.empty(a)
						},
						header : function (a) {
							return vb.test(a.nodeName)
						},
						input : function (a) {
							return ub.test(a.nodeName)
						},
						button : function (a) {
							var b = a.nodeName.toLowerCase();
							return "input" === b && "button" === a.type || "button" === b
						},
						text : function (a) {
							var b;
							return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || b.toLowerCase() === a.type)
						},
						first : k(function () {
							return [0]
						}),
						last : k(function (a, b) {
							return [b - 1]
						}),
						eq : k(function (a, b, c) {
							return [0 > c ? c + b : c]
						}),
						even : k(function (a, b) {
							for (var c = 0; b > c; c += 2)
								a.push(c);
							return a
						}),
						odd : k(function (a, b) {
							for (var c = 1; b > c; c += 2)
								a.push(c);
							return a
						}),
						lt : k(function (a, b, c) {
							for (var d = 0 > c ? c + b : c; --d >= 0; )
								a.push(d);
							return a
						}),
						gt : k(function (a, b, c) {
							for (var d = 0 > c ? c + b : c; ++d < b; )
								a.push(d);
							return a
						})
					}
				},
				z.pseudos.nth = z.pseudos.eq;
				for (w in {
					radio : !0,
					checkbox : !0,
					file : !0,
					password : !0,
					image : !0
				})
					z.pseudos[w] = i(w);
				for (w in {
					submit : !0,
					reset : !0
				})
					z.pseudos[w] = j(w);
				l.prototype = z.filters = z.pseudos,
				z.setFilters = new l,
				C = c.compile = function (a, b) {
					var c,
					d = [],
					e = [],
					f = T[a + " "];
					if (!f) {
						for (b || (b = m(a)), c = b.length; c--; )
							f = s(b[c]), f[N] ? d.push(f) : e.push(f);
						f = T(a, t(e, d))
					}
					return f
				},
				x.sortStable = N.split("").sort(V).join("") === N,
				x.detectDuplicates = U,
				F(),
				x.sortDetached = f(function (a) {
						return 1 & a.compareDocumentPosition(G.createElement("div"))
					}),
				f(function (a) {
					return a.innerHTML = "<a href='#'></a>",
					"#" === a.firstChild.getAttribute("href")
				}) || g("type|href|height|width", function (a, b, c) {
					return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
				}),
				x.attributes && f(function (a) {
					return a.innerHTML = "<input/>",
					a.firstChild.setAttribute("value", ""),
					"" === a.firstChild.getAttribute("value")
				}) || g("value", function (a, b, c) {
					return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
				}),
				f(function (a) {
					return null == a.getAttribute("disabled")
				}) || g(db, function (a, b, c) {
					var d;
					return c ? void 0 : (d = a.getAttributeNode(b)) && d.specified ? d.value : a[b] === !0 ? b.toLowerCase() : null
				}),
				fb.find = c,
				fb.expr = c.selectors,
				fb.expr[":"] = fb.expr.pseudos,
				fb.unique = c.uniqueSort,
				fb.text = c.getText,
				fb.isXMLDoc = c.isXML,
				fb.contains = c.contains
			}
			(a);
			var ob = {};
			fb.Callbacks = function (a) {
				a = "string" == typeof a ? ob[a] || d(a) : fb.extend({}, a);
				var c,
				e,
				f,
				g,
				h,
				i,
				j = [],
				k = !a.once && [],
				l = function (b) {
					for (c = a.memory && b, e = !0, i = g || 0, g = 0, h = j.length, f = !0; j && h > i; i++)
						if (j[i].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
							c = !1;
							break
						}
					f = !1,
					j && (k ? k.length && l(k.shift()) : c ? j = [] : m.disable())
				},
				m = {
					add : function () {
						if (j) {
							var b = j.length;
							!function d(b) {
								fb.each(b, function (b, c) {
									var e = fb.type(c);
									"function" === e ? a.unique && m.has(c) || j.push(c) : c && c.length && "string" !== e && d(c)
								})
							}
							(arguments),
							f ? h = j.length : c && (g = b, l(c))
						}
						return this
					},
					remove : function () {
						return j && fb.each(arguments, function (a, b) {
							for (var c; (c = fb.inArray(b, j, c)) > -1; )
								j.splice(c, 1), f && (h >= c && h--, i >= c && i--)
						}),
						this
					},
					has : function (a) {
						return a ? fb.inArray(a, j) > -1 : !(!j || !j.length)
					},
					empty : function () {
						return j = [],
						h = 0,
						this
					},
					disable : function () {
						return j = k = c = b,
						this
					},
					disabled : function () {
						return !j
					},
					lock : function () {
						return k = b,
						c || m.disable(),
						this
					},
					locked : function () {
						return !k
					},
					fireWith : function (a, b) {
						return !j || e && !k || (b = b || [], b = [a, b.slice ? b.slice() : b], f ? k.push(b) : l(b)),
						this
					},
					fire : function () {
						return m.fireWith(this, arguments),
						this
					},
					fired : function () {
						return !!e
					}
				};
				return m
			},
			fb.extend({
				Deferred : function (a) {
					var b = [["resolve", "done", fb.Callbacks("once memory"), "resolved"], ["reject", "fail", fb.Callbacks("once memory"), "rejected"], ["notify", "progress", fb.Callbacks("memory")]],
					c = "pending",
					d = {
						state : function () {
							return c
						},
						always : function () {
							return e.done(arguments).fail(arguments),
							this
						},
						then : function () {
							var a = arguments;
							return fb.Deferred(function (c) {
								fb.each(b, function (b, f) {
									var g = f[0],
									h = fb.isFunction(a[b]) && a[b];
									e[f[1]](function () {
										var a = h && h.apply(this, arguments);
										a && fb.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[g + "With"](this === d ? c.promise() : this, h ? [a] : arguments)
									})
								}),
								a = null
							}).promise()
						},
						promise : function (a) {
							return null != a ? fb.extend(a, d) : d
						}
					},
					e = {};
					return d.pipe = d.then,
					fb.each(b, function (a, f) {
						var g = f[2],
						h = f[3];
						d[f[1]] = g.add,
						h && g.add(function () {
							c = h
						}, b[1^a][2].disable, b[2][2].lock),
						e[f[0]] = function () {
							return e[f[0] + "With"](this === e ? d : this, arguments),
							this
						},
						e[f[0] + "With"] = g.fireWith
					}),
					d.promise(e),
					a && a.call(e, e),
					e
				},
				when : function (a) {
					var b,
					c,
					d,
					e = 0,
					f = ab.call(arguments),
					g = f.length,
					h = 1 !== g || a && fb.isFunction(a.promise) ? g : 0,
					i = 1 === h ? a : fb.Deferred(),
					j = function (a, c, d) {
						return function (e) {
							c[a] = this,
							d[a] = arguments.length > 1 ? ab.call(arguments) : e,
							d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
						}
					};
					if (g > 1)
						for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++)
							f[e] && fb.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
					return h || i.resolveWith(d, f),
					i.promise()
				}
			}),
			fb.support = function (b) {
				var c = T.createElement("input"),
				d = T.createDocumentFragment(),
				e = T.createElement("div"),
				f = T.createElement("select"),
				g = f.appendChild(T.createElement("option"));
				return c.type ? (c.type = "checkbox", b.checkOn = "" !== c.value, b.optSelected = g.selected, b.reliableMarginRight = !0, b.boxSizingReliable = !0, b.pixelPosition = !1, c.checked = !0, b.noCloneChecked = c.cloneNode(!0).checked, f.disabled = !0, b.optDisabled = !g.disabled, c = T.createElement("input"), c.value = "t", c.type = "radio", b.radioValue = "t" === c.value, c.setAttribute("checked", "t"), c.setAttribute("name", "t"), d.appendChild(c), b.checkClone = d.cloneNode(!0).cloneNode(!0).lastChild.checked, b.focusinBubbles = "onfocusin" in a, e.style.backgroundClip = "content-box", e.cloneNode(!0).style.backgroundClip = "", b.clearCloneStyle = "content-box" === e.style.backgroundClip, fb(function () {
						var c,
						d,
						f = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
						g = T.getElementsByTagName("body")[0];
						g && (c = T.createElement("div"), c.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", g.appendChild(c).appendChild(e), e.innerHTML = "", e.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%", fb.swap(g, null != g.style.zoom ? {
								zoom : 1
							}
								 : {}, function () {
								b.boxSizing = 4 === e.offsetWidth
							}), a.getComputedStyle && (b.pixelPosition = "1%" !== (a.getComputedStyle(e, null) || {}).top, b.boxSizingReliable = "4px" === (a.getComputedStyle(e, null) || {
										width : "4px"
									}).width, d = e.appendChild(T.createElement("div")), d.style.cssText = e.style.cssText = f, d.style.marginRight = d.style.width = "0", e.style.width = "1px", b.reliableMarginRight = !parseFloat((a.getComputedStyle(d, null) || {}).marginRight)), g.removeChild(c))
					}), b) : b
			}
			({});
			var pb,
			qb,
			rb = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
			sb = /([A-Z])/g;
			e.uid = 1,
			e.accepts = function (a) {
				return a.nodeType ? 1 === a.nodeType || 9 === a.nodeType : !0
			},
			e.prototype = {
				key : function (a) {
					if (!e.accepts(a))
						return 0;
					var b = {},
					c = a[this.expando];
					if (!c) {
						c = e.uid++;
						try {
							b[this.expando] = {
								value : c
							},
							Object.defineProperties(a, b)
						} catch (d) {
							b[this.expando] = c,
							fb.extend(a, b)
						}
					}
					return this.cache[c] || (this.cache[c] = {}),
					c
				},
				set : function (a, b, c) {
					var d,
					e = this.key(a),
					f = this.cache[e];
					if ("string" == typeof b)
						f[b] = c;
					else if (fb.isEmptyObject(f))
						fb.extend(this.cache[e], b);
					else
						for (d in b)
							f[d] = b[d];
					return f
				},
				get : function (a, c) {
					var d = this.cache[this.key(a)];
					return c === b ? d : d[c]
				},
				access : function (a, c, d) {
					var e;
					return c === b || c && "string" == typeof c && d === b ? (e = this.get(a, c), e !== b ? e : this.get(a, fb.camelCase(c))) : (this.set(a, c, d), d !== b ? d : c)
				},
				remove : function (a, c) {
					var d,
					e,
					f,
					g = this.key(a),
					h = this.cache[g];
					if (c === b)
						this.cache[g] = {};
					else {
						fb.isArray(c) ? e = c.concat(c.map(fb.camelCase)) : (f = fb.camelCase(c), c in h ? e = [c, f] : (e = f, e = e in h ? [e] : e.match(hb) || [])),
						d = e.length;
						for (; d--; )
							delete h[e[d]]
					}
				},
				hasData : function (a) {
					return !fb.isEmptyObject(this.cache[a[this.expando]] || {})
				},
				discard : function (a) {
					a[this.expando] && delete this.cache[a[this.expando]]
				}
			},
			pb = new e,
			qb = new e,
			fb.extend({
				acceptData : e.accepts,
				hasData : function (a) {
					return pb.hasData(a) || qb.hasData(a)
				},
				data : function (a, b, c) {
					return pb.access(a, b, c)
				},
				removeData : function (a, b) {
					pb.remove(a, b)
				},
				_data : function (a, b, c) {
					return qb.access(a, b, c)
				},
				_removeData : function (a, b) {
					qb.remove(a, b)
				}
			}),
			fb.fn.extend({
				data : function (a, c) {
					var d,
					e,
					g = this[0],
					h = 0,
					i = null;
					if (a === b) {
						if (this.length && (i = pb.get(g), 1 === g.nodeType && !qb.get(g, "hasDataAttrs"))) {
							for (d = g.attributes; h < d.length; h++)
								e = d[h].name, 0 === e.indexOf("data-") && (e = fb.camelCase(e.slice(5)), f(g, e, i[e]));
							qb.set(g, "hasDataAttrs", !0)
						}
						return i
					}
					return "object" == typeof a ? this.each(function () {
						pb.set(this, a)
					}) : fb.access(this, function (c) {
						var d,
						e = fb.camelCase(a);
						if (g && c === b) {
							if (d = pb.get(g, a), d !== b)
								return d;
							if (d = pb.get(g, e), d !== b)
								return d;
							if (d = f(g, e, b), d !== b)
								return d
						} else
							this.each(function () {
								var d = pb.get(this, e);
								pb.set(this, e, c),
								-1 !== a.indexOf("-") && d !== b && pb.set(this, a, c)
							})
					}, null, c, arguments.length > 1, null, !0)
				},
				removeData : function (a) {
					return this.each(function () {
						pb.remove(this, a)
					})
				}
			}),
			fb.extend({
				queue : function (a, b, c) {
					var d;
					return a ? (b = (b || "fx") + "queue", d = qb.get(a, b), c && (!d || fb.isArray(c) ? d = qb.access(a, b, fb.makeArray(c)) : d.push(c)), d || []) : void 0
				},
				dequeue : function (a, b) {
					b = b || "fx";
					var c = fb.queue(a, b),
					d = c.length,
					e = c.shift(),
					f = fb._queueHooks(a, b),
					g = function () {
						fb.dequeue(a, b)
					};
					"inprogress" === e && (e = c.shift(), d--),
					e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)),
					!d && f && f.empty.fire()
				},
				_queueHooks : function (a, b) {
					var c = b + "queueHooks";
					return qb.get(a, c) || qb.access(a, c, {
						empty : fb.Callbacks("once memory").add(function () {
							qb.remove(a, [b + "queue", c])
						})
					})
				}
			}),
			fb.fn.extend({
				queue : function (a, c) {
					var d = 2;
					return "string" != typeof a && (c = a, a = "fx", d--),
					arguments.length < d ? fb.queue(this[0], a) : c === b ? this : this.each(function () {
						var b = fb.queue(this, a, c);
						fb._queueHooks(this, a),
						"fx" === a && "inprogress" !== b[0] && fb.dequeue(this, a)
					})
				},
				dequeue : function (a) {
					return this.each(function () {
						fb.dequeue(this, a)
					})
				},
				delay : function (a, b) {
					return a = fb.fx ? fb.fx.speeds[a] || a : a,
					b = b || "fx",
					this.queue(b, function (b, c) {
						var d = setTimeout(b, a);
						c.stop = function () {
							clearTimeout(d)
						}
					})
				},
				clearQueue : function (a) {
					return this.queue(a || "fx", [])
				},
				promise : function (a, c) {
					var d,
					e = 1,
					f = fb.Deferred(),
					g = this,
					h = this.length,
					i = function () {
						--e || f.resolveWith(g, [g])
					};
					for ("string" != typeof a && (c = a, a = b), a = a || "fx"; h--; )
						d = qb.get(g[h], a + "queueHooks"), d && d.empty && (e++, d.empty.add(i));
					return i(),
					f.promise(c)
				}
			});
			var tb,
			ub,
			vb = /[\t\r\n\f]/g,
			wb = /\r/g,
			xb = /^(?:input|select|textarea|button)$/i;
			fb.fn.extend({
				attr : function (a, b) {
					return fb.access(this, fb.attr, a, b, arguments.length > 1)
				},
				removeAttr : function (a) {
					return this.each(function () {
						fb.removeAttr(this, a)
					})
				},
				prop : function (a, b) {
					return fb.access(this, fb.prop, a, b, arguments.length > 1)
				},
				removeProp : function (a) {
					return this.each(function () {
						delete this[fb.propFix[a] || a]
					})
				},
				addClass : function (a) {
					var b,
					c,
					d,
					e,
					f,
					g = 0,
					h = this.length,
					i = "string" == typeof a && a;
					if (fb.isFunction(a))
						return this.each(function (b) {
							fb(this).addClass(a.call(this, b, this.className))
						});
					if (i)
						for (b = (a || "").match(hb) || []; h > g; g++)
							if (c = this[g], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vb, " ") : " ")) {
								for (f = 0; e = b[f++]; )
									d.indexOf(" " + e + " ") < 0 && (d += e + " ");
								c.className = fb.trim(d)
							}
					return this
				},
				removeClass : function (a) {
					var b,
					c,
					d,
					e,
					f,
					g = 0,
					h = this.length,
					i = 0 === arguments.length || "string" == typeof a && a;
					if (fb.isFunction(a))
						return this.each(function (b) {
							fb(this).removeClass(a.call(this, b, this.className))
						});
					if (i)
						for (b = (a || "").match(hb) || []; h > g; g++)
							if (c = this[g], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vb, " ") : "")) {
								for (f = 0; e = b[f++]; )
									for (; d.indexOf(" " + e + " ") >= 0; )
										d = d.replace(" " + e + " ", " ");
								c.className = a ? fb.trim(d) : ""
							}
					return this
				},
				toggleClass : function (a, b) {
					var c = typeof a;
					return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : fb.isFunction(a) ? this.each(function (c) {
						fb(this).toggleClass(a.call(this, c, this.className, b), b)
					}) : this.each(function () {
						if ("string" === c)
							for (var b, d = 0, e = fb(this), f = a.match(hb) || []; b = f[d++]; )
								e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
						else (c === R || "boolean" === c) && (this.className && qb.set(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : qb.get(this, "__className__") || "")
					})
				},
				hasClass : function (a) {
					for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
						if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(vb, " ").indexOf(b) >= 0)
							return !0;
					return !1
				},
				val : function (a) {
					var c,
					d,
					e,
					f = this[0]; {
						if (arguments.length)
							return e = fb.isFunction(a), this.each(function (d) {
								var f;
								1 === this.nodeType && (f = e ? a.call(this, d, fb(this).val()) : a, null == f ? f = "" : "number" == typeof f ? f += "" : fb.isArray(f) && (f = fb.map(f, function (a) {
													return null == a ? "" : a + ""
												})), c = fb.valHooks[this.type] || fb.valHooks[this.nodeName.toLowerCase()], c && "set" in c && c.set(this, f, "value") !== b || (this.value = f))
							});
						if (f)
							return c = fb.valHooks[f.type] || fb.valHooks[f.nodeName.toLowerCase()], c && "get" in c && (d = c.get(f, "value")) !== b ? d : (d = f.value, "string" == typeof d ? d.replace(wb, "") : null == d ? "" : d)
					}
				}
			}),
			fb.extend({
				valHooks : {
					option : {
						get : function (a) {
							var b = a.attributes.value;
							return !b || b.specified ? a.value : a.text
						}
					},
					select : {
						get : function (a) {
							for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
								if (c = d[i], !(!c.selected && i !== e || (fb.support.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && fb.nodeName(c.parentNode, "optgroup"))) {
									if (b = fb(c).val(), f)
										return b;
									g.push(b)
								}
							return g
						},
						set : function (a, b) {
							for (var c, d, e = a.options, f = fb.makeArray(b), g = e.length; g--; )
								d = e[g], (d.selected = fb.inArray(fb(d).val(), f) >= 0) && (c = !0);
							return c || (a.selectedIndex = -1),
							f
						}
					}
				},
				attr : function (a, c, d) {
					var e,
					f,
					g = a.nodeType;
					if (a && 3 !== g && 8 !== g && 2 !== g)
						return typeof a.getAttribute === R ? fb.prop(a, c, d) : (1 === g && fb.isXMLDoc(a) || (c = c.toLowerCase(), e = fb.attrHooks[c] || (fb.expr.match.bool.test(c) ? ub : tb)), d === b ? e && "get" in e && null !== (f = e.get(a, c)) ? f : (f = fb.find.attr(a, c), null == f ? b : f) : null !== d ? e && "set" in e && (f = e.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ""), d) : (fb.removeAttr(a, c), void 0))
				},
				removeAttr : function (a, b) {
					var c,
					d,
					e = 0,
					f = b && b.match(hb);
					if (f && 1 === a.nodeType)
						for (; c = f[e++]; )
							d = fb.propFix[c] || c, fb.expr.match.bool.test(c) && (a[d] = !1), a.removeAttribute(c)
				},
				attrHooks : {
					type : {
						set : function (a, b) {
							if (!fb.support.radioValue && "radio" === b && fb.nodeName(a, "input")) {
								var c = a.value;
								return a.setAttribute("type", b),
								c && (a.value = c),
								b
							}
						}
					}
				},
				propFix : {
					"for" : "htmlFor",
					"class" : "className"
				},
				prop : function (a, c, d) {
					var e,
					f,
					g,
					h = a.nodeType;
					if (a && 3 !== h && 8 !== h && 2 !== h)
						return g = 1 !== h || !fb.isXMLDoc(a), g && (c = fb.propFix[c] || c, f = fb.propHooks[c]), d !== b ? f && "set" in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get" in f && null !== (e = f.get(a, c)) ? e : a[c]
				},
				propHooks : {
					tabIndex : {
						get : function (a) {
							return a.hasAttribute("tabindex") || xb.test(a.nodeName) || a.href ? a.tabIndex : -1
						}
					}
				}
			}),
			ub = {
				set : function (a, b, c) {
					return b === !1 ? fb.removeAttr(a, c) : a.setAttribute(c, c),
					c
				}
			},
			fb.each(fb.expr.match.bool.source.match(/\w+/g), function (a, c) {
				var d = fb.expr.attrHandle[c] || fb.find.attr;
				fb.expr.attrHandle[c] = function (a, c, e) {
					var f = fb.expr.attrHandle[c],
					g = e ? b : (fb.expr.attrHandle[c] = b) != d(a, c, e) ? c.toLowerCase() : null;
					return fb.expr.attrHandle[c] = f,
					g
				}
			}),
			fb.support.optSelected || (fb.propHooks.selected = {
					get : function (a) {
						var b = a.parentNode;
						return b && b.parentNode && b.parentNode.selectedIndex,
						null
					}
				}),
			fb.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
				fb.propFix[this.toLowerCase()] = this
			}),
			fb.each(["radio", "checkbox"], function () {
				fb.valHooks[this] = {
					set : function (a, b) {
						return fb.isArray(b) ? a.checked = fb.inArray(fb(a).val(), b) >= 0 : void 0
					}
				},
				fb.support.checkOn || (fb.valHooks[this].get = function (a) {
					return null === a.getAttribute("value") ? "on" : a.value
				})
			});
			var yb = /^key/,
			zb = /^(?:mouse|contextmenu)|click/,
			Ab = /^(?:focusinfocus|focusoutblur)$/,
			Bb = /^([^.]*)(?:\.(.+)|)$/;
			fb.event = {
				global : {},
				add : function (a, c, d, e, f) {
					var g,
					h,
					i,
					j,
					k,
					l,
					m,
					n,
					o,
					p,
					q,
					r = qb.get(a);
					if (r) {
						for (d.handler && (g = d, d = g.handler, f = g.selector), d.guid || (d.guid = fb.guid++), (j = r.events) || (j = r.events = {}), (h = r.handle) || (h = r.handle = function (a) {
								return typeof fb === R || a && fb.event.triggered === a.type ? b : fb.event.dispatch.apply(h.elem, arguments)
							}, h.elem = a), c = (c || "").match(hb) || [""], k = c.length; k--; )
							i = Bb.exec(c[k]) || [], o = q = i[1], p = (i[2] || "").split(".").sort(), o && (m = fb.event.special[o] || {}, o = (f ? m.delegateType : m.bindType) || o, m = fb.event.special[o] || {}, l = fb.extend({
										type : o,
										origType : q,
										data : e,
										handler : d,
										guid : d.guid,
										selector : f,
										needsContext : f && fb.expr.match.needsContext.test(f),
										namespace : p.join(".")
									}, g), (n = j[o]) || (n = j[o] = [], n.delegateCount = 0, m.setup && m.setup.call(a, e, p, h) !== !1 || a.addEventListener && a.addEventListener(o, h, !1)), m.add && (m.add.call(a, l), l.handler.guid || (l.handler.guid = d.guid)), f ? n.splice(n.delegateCount++, 0, l) : n.push(l), fb.event.global[o] = !0);
						a = null
					}
				},
				remove : function (a, b, c, d, e) {
					var f,
					g,
					h,
					i,
					j,
					k,
					l,
					m,
					n,
					o,
					p,
					q = qb.hasData(a) && qb.get(a);
					if (q && (i = q.events)) {
						for (b = (b || "").match(hb) || [""], j = b.length; j--; )
							if (h = Bb.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
								for (l = fb.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = i[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length; f--; )
									k = m[f], !e && p !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k));
								g && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || fb.removeEvent(a, n, q.handle), delete i[n])
							} else
								for (n in i)
									fb.event.remove(a, n + b[j], c, d, !0);
						fb.isEmptyObject(i) && (delete q.handle, qb.remove(a, "events"))
					}
				},
				trigger : function (c, d, e, f) {
					var g,
					h,
					i,
					j,
					k,
					l,
					m,
					n = [e || T],
					o = db.call(c, "type") ? c.type : c,
					p = db.call(c, "namespace") ? c.namespace.split(".") : [];
					if (h = i = e = e || T, 3 !== e.nodeType && 8 !== e.nodeType && !Ab.test(o + fb.event.triggered) && (o.indexOf(".") >= 0 && (p = o.split("."), o = p.shift(), p.sort()), k = o.indexOf(":") < 0 && "on" + o, c = c[fb.expando] ? c : new fb.Event(o, "object" == typeof c && c), c.isTrigger = f ? 2 : 3, c.namespace = p.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, c.result = b, c.target || (c.target = e), d = null == d ? [c] : fb.makeArray(d, [c]), m = fb.event.special[o] || {}, f || !m.trigger || m.trigger.apply(e, d) !== !1)) {
						if (!f && !m.noBubble && !fb.isWindow(e)) {
							for (j = m.delegateType || o, Ab.test(j + o) || (h = h.parentNode); h; h = h.parentNode)
								n.push(h), i = h;
							i === (e.ownerDocument || T) && n.push(i.defaultView || i.parentWindow || a)
						}
						for (g = 0; (h = n[g++]) && !c.isPropagationStopped(); )
							c.type = g > 1 ? j : m.bindType || o, l = (qb.get(h, "events") || {})[c.type] && qb.get(h, "handle"), l && l.apply(h, d), l = k && h[k], l && fb.acceptData(h) && l.apply && l.apply(h, d) === !1 && c.preventDefault();
						return c.type = o,
						f || c.isDefaultPrevented() || m._default && m._default.apply(n.pop(), d) !== !1 || !fb.acceptData(e) || k && fb.isFunction(e[o]) && !fb.isWindow(e) && (i = e[k], i && (e[k] = null), fb.event.triggered = o, e[o](), fb.event.triggered = b, i && (e[k] = i)),
						c.result
					}
				},
				dispatch : function (a) {
					a = fb.event.fix(a);
					var c,
					d,
					e,
					f,
					g,
					h = [],
					i = ab.call(arguments),
					j = (qb.get(this, "events") || {})[a.type] || [],
					k = fb.event.special[a.type] || {};
					if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
						for (h = fb.event.handlers.call(this, a, j), c = 0; (f = h[c++]) && !a.isPropagationStopped(); )
							for (a.currentTarget = f.elem, d = 0; (g = f.handlers[d++]) && !a.isImmediatePropagationStopped(); )
								(!a.namespace_re || a.namespace_re.test(g.namespace)) && (a.handleObj = g, a.data = g.data, e = ((fb.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), e !== b && (a.result = e) === !1 && (a.preventDefault(), a.stopPropagation()));
						return k.postDispatch && k.postDispatch.call(this, a),
						a.result
					}
				},
				handlers : function (a, c) {
					var d,
					e,
					f,
					g,
					h = [],
					i = c.delegateCount,
					j = a.target;
					if (i && j.nodeType && (!a.button || "click" !== a.type))
						for (; j !== this; j = j.parentNode || this)
							if (j.disabled !== !0 || "click" !== a.type) {
								for (e = [], d = 0; i > d; d++)
									g = c[d], f = g.selector + " ", e[f] === b && (e[f] = g.needsContext ? fb(f, this).index(j) >= 0 : fb.find(f, this, null, [j]).length), e[f] && e.push(g);
								e.length && h.push({
									elem : j,
									handlers : e
								})
							}
					return i < c.length && h.push({
						elem : this,
						handlers : c.slice(i)
					}),
					h
				},
				props : "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
				fixHooks : {},
				keyHooks : {
					props : "char charCode key keyCode".split(" "),
					filter : function (a, b) {
						return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode),
						a
					}
				},
				mouseHooks : {
					props : "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
					filter : function (a, c) {
						var d,
						e,
						f,
						g = c.button;
						return null == a.pageX && null != c.clientX && (d = a.target.ownerDocument || T, e = d.documentElement, f = d.body, a.pageX = c.clientX + (e && e.scrollLeft || f && f.scrollLeft || 0) - (e && e.clientLeft || f && f.clientLeft || 0), a.pageY = c.clientY + (e && e.scrollTop || f && f.scrollTop || 0) - (e && e.clientTop || f && f.clientTop || 0)),
						a.which || g === b || (a.which = 1 & g ? 1 : 2 & g ? 3 : 4 & g ? 2 : 0),
						a
					}
				},
				fix : function (a) {
					if (a[fb.expando])
						return a;
					var b,
					c,
					d,
					e = a.type,
					f = a,
					g = this.fixHooks[e];
					for (g || (this.fixHooks[e] = g = zb.test(e) ? this.mouseHooks : yb.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new fb.Event(f), b = d.length; b--; )
						c = d[b], a[c] = f[c];
					return a.target || (a.target = T),
					3 === a.target.nodeType && (a.target = a.target.parentNode),
					g.filter ? g.filter(a, f) : a
				},
				special : {
					load : {
						noBubble : !0
					},
					focus : {
						trigger : function () {
							return this !== i() && this.focus ? (this.focus(), !1) : void 0
						},
						delegateType : "focusin"
					},
					blur : {
						trigger : function () {
							return this === i() && this.blur ? (this.blur(), !1) : void 0
						},
						delegateType : "focusout"
					},
					click : {
						trigger : function () {
							return "checkbox" === this.type && this.click && fb.nodeName(this, "input") ? (this.click(), !1) : void 0
						},
						_default : function (a) {
							return fb.nodeName(a.target, "a")
						}
					},
					beforeunload : {
						postDispatch : function (a) {
							a.result !== b && (a.originalEvent.returnValue = a.result)
						}
					}
				},
				simulate : function (a, b, c, d) {
					var e = fb.extend(new fb.Event, c, {
							type : a,
							isSimulated : !0,
							originalEvent : {}

						});
					d ? fb.event.trigger(e, null, b) : fb.event.dispatch.call(b, e),
					e.isDefaultPrevented() && c.preventDefault()
				}
			},
			fb.removeEvent = function (a, b, c) {
				a.removeEventListener && a.removeEventListener(b, c, !1)
			},
			fb.Event = function (a, b) {
				return this instanceof fb.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.getPreventDefault && a.getPreventDefault() ? g : h) : this.type = a, b && fb.extend(this, b), this.timeStamp = a && a.timeStamp || fb.now(), this[fb.expando] = !0, void 0) : new fb.Event(a, b)
			},
			fb.Event.prototype = {
				isDefaultPrevented : h,
				isPropagationStopped : h,
				isImmediatePropagationStopped : h,
				preventDefault : function () {
					var a = this.originalEvent;
					this.isDefaultPrevented = g,
					a && a.preventDefault && a.preventDefault()
				},
				stopPropagation : function () {
					var a = this.originalEvent;
					this.isPropagationStopped = g,
					a && a.stopPropagation && a.stopPropagation()
				},
				stopImmediatePropagation : function () {
					this.isImmediatePropagationStopped = g,
					this.stopPropagation()
				}
			},
			fb.each({
				mouseenter : "mouseover",
				mouseleave : "mouseout"
			}, function (a, b) {
				fb.event.special[a] = {
					delegateType : b,
					bindType : b,
					handle : function (a) {
						var c,
						d = this,
						e = a.relatedTarget,
						f = a.handleObj;
						return (!e || e !== d && !fb.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b),
						c
					}
				}
			}),
			fb.support.focusinBubbles || fb.each({
				focus : "focusin",
				blur : "focusout"
			}, function (a, b) {
				var c = 0,
				d = function (a) {
					fb.event.simulate(b, a.target, fb.event.fix(a), !0)
				};
				fb.event.special[b] = {
					setup : function () {
						0 === c++ && T.addEventListener(a, d, !0)
					},
					teardown : function () {
						0 === --c && T.removeEventListener(a, d, !0)
					}
				}
			}),
			fb.fn.extend({
				on : function (a, c, d, e, f) {
					var g,
					i;
					if ("object" == typeof a) {
						"string" != typeof c && (d = d || c, c = b);
						for (i in a)
							this.on(i, c, d, a[i], f);
						return this
					}
					if (null == d && null == e ? (e = c, d = c = b) : null == e && ("string" == typeof c ? (e = d, d = b) : (e = d, d = c, c = b)), e === !1)
						e = h;
					else if (!e)
						return this;
					return 1 === f && (g = e, e = function (a) {
						return fb().off(a),
						g.apply(this, arguments)
					}, e.guid = g.guid || (g.guid = fb.guid++)),
					this.each(function () {
						fb.event.add(this, a, e, d, c)
					})
				},
				one : function (a, b, c, d) {
					return this.on(a, b, c, d, 1)
				},
				off : function (a, c, d) {
					var e,
					f;
					if (a && a.preventDefault && a.handleObj)
						return e = a.handleObj, fb(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this;
					if ("object" == typeof a) {
						for (f in a)
							this.off(f, c, a[f]);
						return this
					}
					return (c === !1 || "function" == typeof c) && (d = c, c = b),
					d === !1 && (d = h),
					this.each(function () {
						fb.event.remove(this, a, d, c)
					})
				},
				trigger : function (a, b) {
					return this.each(function () {
						fb.event.trigger(a, b, this)
					})
				},
				triggerHandler : function (a, b) {
					var c = this[0];
					return c ? fb.event.trigger(a, b, c, !0) : void 0
				}
			});
			var Cb = /^.[^:#\[\.,]*$/,
			Db = /^(?:parents|prev(?:Until|All))/,
			Eb = fb.expr.match.needsContext,
			Fb = {
				children : !0,
				contents : !0,
				next : !0,
				prev : !0
			};
			fb.fn.extend({
				find : function (a) {
					var b,
					c = [],
					d = this,
					e = d.length;
					if ("string" != typeof a)
						return this.pushStack(fb(a).filter(function () {
								for (b = 0; e > b; b++)
									if (fb.contains(d[b], this))
										return !0
							}));
					for (b = 0; e > b; b++)
						fb.find(a, d[b], c);
					return c = this.pushStack(e > 1 ? fb.unique(c) : c),
					c.selector = this.selector ? this.selector + " " + a : a,
					c
				},
				has : function (a) {
					var b = fb(a, this),
					c = b.length;
					return this.filter(function () {
						for (var a = 0; c > a; a++)
							if (fb.contains(this, b[a]))
								return !0
					})
				},
				not : function (a) {
					return this.pushStack(k(this, a || [], !0))
				},
				filter : function (a) {
					return this.pushStack(k(this, a || [], !1))
				},
				is : function (a) {
					return !!k(this, "string" == typeof a && Eb.test(a) ? fb(a) : a || [], !1).length
				},
				closest : function (a, b) {
					for (var c, d = 0, e = this.length, f = [], g = Eb.test(a) || "string" != typeof a ? fb(a, b || this.context) : 0; e > d; d++)
						for (c = this[d]; c && c !== b; c = c.parentNode)
							if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && fb.find.matchesSelector(c, a))) {
								c = f.push(c);
								break
							}
					return this.pushStack(f.length > 1 ? fb.unique(f) : f)
				},
				index : function (a) {
					return a ? "string" == typeof a ? bb.call(fb(a), this[0]) : bb.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
				},
				add : function (a, b) {
					var c = "string" == typeof a ? fb(a, b) : fb.makeArray(a && a.nodeType ? [a] : a),
					d = fb.merge(this.get(), c);
					return this.pushStack(fb.unique(d))
				},
				addBack : function (a) {
					return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
				}
			}),
			fb.each({
				parent : function (a) {
					var b = a.parentNode;
					return b && 11 !== b.nodeType ? b : null
				},
				parents : function (a) {
					return fb.dir(a, "parentNode")
				},
				parentsUntil : function (a, b, c) {
					return fb.dir(a, "parentNode", c)
				},
				next : function (a) {
					return j(a, "nextSibling")
				},
				prev : function (a) {
					return j(a, "previousSibling")
				},
				nextAll : function (a) {
					return fb.dir(a, "nextSibling")
				},
				prevAll : function (a) {
					return fb.dir(a, "previousSibling")
				},
				nextUntil : function (a, b, c) {
					return fb.dir(a, "nextSibling", c)
				},
				prevUntil : function (a, b, c) {
					return fb.dir(a, "previousSibling", c)
				},
				siblings : function (a) {
					return fb.sibling((a.parentNode || {}).firstChild, a)
				},
				children : function (a) {
					return fb.sibling(a.firstChild)
				},
				contents : function (a) {
					return a.contentDocument || fb.merge([], a.childNodes)
				}
			}, function (a, b) {
				fb.fn[a] = function (c, d) {
					var e = fb.map(this, b, c);
					return "Until" !== a.slice(-5) && (d = c),
					d && "string" == typeof d && (e = fb.filter(d, e)),
					this.length > 1 && (Fb[a] || fb.unique(e), Db.test(a) && e.reverse()),
					this.pushStack(e)
				}
			}),
			fb.extend({
				filter : function (a, b, c) {
					var d = b[0];
					return c && (a = ":not(" + a + ")"),
					1 === b.length && 1 === d.nodeType ? fb.find.matchesSelector(d, a) ? [d] : [] : fb.find.matches(a, fb.grep(b, function (a) {
							return 1 === a.nodeType
						}))
				},
				dir : function (a, c, d) {
					for (var e = [], f = d !== b; (a = a[c]) && 9 !== a.nodeType; )
						if (1 === a.nodeType) {
							if (f && fb(a).is(d))
								break;
							e.push(a)
						}
					return e
				},
				sibling : function (a, b) {
					for (var c = []; a; a = a.nextSibling)
						1 === a.nodeType && a !== b && c.push(a);
					return c
				}
			});
			var Gb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
			Hb = /<([\w:]+)/,
			Ib = /<|&#?\w+;/,
			Jb = /<(?:script|style|link)/i,
			Kb = /^(?:checkbox|radio)$/i,
			Lb = /checked\s*(?:[^=]|=\s*.checked.)/i,
			Mb = /^$|\/(?:java|ecma)script/i,
			Nb = /^true\/(.*)/,
			Ob = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
			Pb = {
				option : [1, "<select multiple='multiple'>", "</select>"],
				thead : [1, "<table>", "</table>"],
				col : [2, "<table><colgroup>", "</colgroup></table>"],
				tr : [2, "<table><tbody>", "</tbody></table>"],
				td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
				_default : [0, "", ""]
			};
			Pb.optgroup = Pb.option,
			Pb.tbody = Pb.tfoot = Pb.colgroup = Pb.caption = Pb.thead,
			Pb.th = Pb.td,
			fb.fn.extend({
				text : function (a) {
					return fb.access(this, function (a) {
						return a === b ? fb.text(this) : this.empty().append((this[0] && this[0].ownerDocument || T).createTextNode(a))
					}, null, a, arguments.length)
				},
				append : function () {
					return this.domManip(arguments, function (a) {
						if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
							var b = l(this, a);
							b.appendChild(a)
						}
					})
				},
				prepend : function () {
					return this.domManip(arguments, function (a) {
						if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
							var b = l(this, a);
							b.insertBefore(a, b.firstChild)
						}
					})
				},
				before : function () {
					return this.domManip(arguments, function (a) {
						this.parentNode && this.parentNode.insertBefore(a, this)
					})
				},
				after : function () {
					return this.domManip(arguments, function (a) {
						this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
					})
				},
				remove : function (a, b) {
					for (var c, d = a ? fb.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
						b || 1 !== c.nodeType || fb.cleanData(q(c)), c.parentNode && (b && fb.contains(c.ownerDocument, c) && o(q(c, "script")), c.parentNode.removeChild(c));
					return this
				},
				empty : function () {
					for (var a, b = 0; null != (a = this[b]); b++)
						1 === a.nodeType && (fb.cleanData(q(a, !1)), a.textContent = "");
					return this
				},
				clone : function (a, b) {
					return a = null == a ? !1 : a,
					b = null == b ? a : b,
					this.map(function () {
						return fb.clone(this, a, b)
					})
				},
				html : function (a) {
					return fb.access(this, function (a) {
						var c = this[0] || {},
						d = 0,
						e = this.length;
						if (a === b && 1 === c.nodeType)
							return c.innerHTML;
						if ("string" == typeof a && !Jb.test(a) && !Pb[(Hb.exec(a) || ["", ""])[1].toLowerCase()]) {
							a = a.replace(Gb, "<$1></$2>");
							try {
								for (; e > d; d++)
									c = this[d] || {},
								1 === c.nodeType && (fb.cleanData(q(c, !1)), c.innerHTML = a);
								c = 0
							} catch (f) {}

						}
						c && this.empty().append(a)
					}, null, a, arguments.length)
				},
				replaceWith : function () {
					var a = fb.map(this, function (a) {
							return [a.nextSibling, a.parentNode]
						}),
					b = 0;
					return this.domManip(arguments, function (c) {
						var d = a[b++],
						e = a[b++];
						e && (d && d.parentNode !== e && (d = this.nextSibling), fb(this).remove(), e.insertBefore(c, d))
					}, !0),
					b ? this : this.remove()
				},
				detach : function (a) {
					return this.remove(a, !0)
				},
				domManip : function (a, b, c) {
					a = $.apply([], a);
					var d,
					e,
					f,
					g,
					h,
					i,
					j = 0,
					k = this.length,
					l = this,
					o = k - 1,
					p = a[0],
					r = fb.isFunction(p);
					if (r || !(1 >= k || "string" != typeof p || fb.support.checkClone) && Lb.test(p))
						return this.each(function (d) {
							var e = l.eq(d);
							r && (a[0] = p.call(this, d, e.html())),
							e.domManip(a, b, c)
						});
					if (k && (d = fb.buildFragment(a, this[0].ownerDocument, !1, !c && this), e = d.firstChild, 1 === d.childNodes.length && (d = e), e)) {
						for (f = fb.map(q(d, "script"), m), g = f.length; k > j; j++)
							h = d, j !== o && (h = fb.clone(h, !0, !0), g && fb.merge(f, q(h, "script"))), b.call(this[j], h, j);
						if (g)
							for (i = f[f.length - 1].ownerDocument, fb.map(f, n), j = 0; g > j; j++)
								h = f[j], Mb.test(h.type || "") && !qb.access(h, "globalEval") && fb.contains(i, h) && (h.src ? fb._evalUrl(h.src) : fb.globalEval(h.textContent.replace(Ob, "")))
					}
					return this
				}
			}),
			fb.each({
				appendTo : "append",
				prependTo : "prepend",
				insertBefore : "before",
				insertAfter : "after",
				replaceAll : "replaceWith"
			}, function (a, b) {
				fb.fn[a] = function (a) {
					for (var c, d = [], e = fb(a), f = e.length - 1, g = 0; f >= g; g++)
						c = g === f ? this : this.clone(!0), fb(e[g])[b](c), _.apply(d, c.get());
					return this.pushStack(d)
				}
			}),
			fb.extend({
				clone : function (a, b, c) {
					var d,
					e,
					f,
					g,
					h = a.cloneNode(!0),
					i = fb.contains(a.ownerDocument, a);
					if (!(fb.support.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || fb.isXMLDoc(a)))
						for (g = q(h), f = q(a), d = 0, e = f.length; e > d; d++)
							r(f[d], g[d]);
					if (b)
						if (c)
							for (f = f || q(a), g = g || q(h), d = 0, e = f.length; e > d; d++)
								p(f[d], g[d]);
						else
							p(a, h);
					return g = q(h, "script"),
					g.length > 0 && o(g, !i && q(a, "script")),
					h
				},
				buildFragment : function (a, b, c, d) {
					for (var e, f, g, h, i, j, k = 0, l = a.length, m = b.createDocumentFragment(), n = []; l > k; k++)
						if (e = a[k], e || 0 === e)
							if ("object" === fb.type(e))
								fb.merge(n, e.nodeType ? [e] : e);
							else if (Ib.test(e)) {
								for (f = f || m.appendChild(b.createElement("div")), g = (Hb.exec(e) || ["", ""])[1].toLowerCase(), h = Pb[g] || Pb._default, f.innerHTML = h[1] + e.replace(Gb, "<$1></$2>") + h[2], j = h[0]; j--; )
									f = f.lastChild;
								fb.merge(n, f.childNodes),
								f = m.firstChild,
								f.textContent = ""
							} else
								n.push(b.createTextNode(e));
					for (m.textContent = "", k = 0; e = n[k++]; )
						if ((!d || -1 === fb.inArray(e, d)) && (i = fb.contains(e.ownerDocument, e), f = q(m.appendChild(e), "script"), i && o(f), c))
							for (j = 0; e = f[j++]; )
								Mb.test(e.type || "") && c.push(e);
					return m
				},
				cleanData : function (a) {
					for (var c, d, f, g, h, i, j = fb.event.special, k = 0; (d = a[k]) !== b; k++) {
						if (e.accepts(d) && (h = d[qb.expando], h && (c = qb.cache[h]))) {
							if (f = Object.keys(c.events || {}), f.length)
								for (i = 0; (g = f[i]) !== b; i++)
									j[g] ? fb.event.remove(d, g) : fb.removeEvent(d, g, c.handle);
							qb.cache[h] && delete qb.cache[h]
						}
						delete pb.cache[d[pb.expando]]
					}
				},
				_evalUrl : function (a) {
					return fb.ajax({
						url : a,
						type : "GET",
						dataType : "script",
						async : !1,
						global : !1,
						"throws" : !0
					})
				}
			}),
			fb.fn.extend({
				wrapAll : function (a) {
					var b;
					return fb.isFunction(a) ? this.each(function (b) {
						fb(this).wrapAll(a.call(this, b))
					}) : (this[0] && (b = fb(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
								for (var a = this; a.firstElementChild; )
									a = a.firstElementChild;
								return a
							}).append(this)), this)
				},
				wrapInner : function (a) {
					return fb.isFunction(a) ? this.each(function (b) {
						fb(this).wrapInner(a.call(this, b))
					}) : this.each(function () {
						var b = fb(this),
						c = b.contents();
						c.length ? c.wrapAll(a) : b.append(a)
					})
				},
				wrap : function (a) {
					var b = fb.isFunction(a);
					return this.each(function (c) {
						fb(this).wrapAll(b ? a.call(this, c) : a)
					})
				},
				unwrap : function () {
					return this.parent().each(function () {
						fb.nodeName(this, "body") || fb(this).replaceWith(this.childNodes)
					}).end()
				}
			});
			var Qb,
			Rb,
			Sb = /^(none|table(?!-c[ea]).+)/,
			Tb = /^margin/,
			Ub = new RegExp("^(" + gb + ")(.*)$", "i"),
			Vb = new RegExp("^(" + gb + ")(?!px)[a-z%]+$", "i"),
			Wb = new RegExp("^([+-])=(" + gb + ")", "i"),
			Xb = {
				BODY : "block"
			},
			Yb = {
				position : "absolute",
				visibility : "hidden",
				display : "block"
			},
			Zb = {
				letterSpacing : 0,
				fontWeight : 400
			},
			$b = ["Top", "Right", "Bottom", "Left"],
			_b = ["Webkit", "O", "Moz", "ms"];
			fb.fn.extend({
				css : function (a, c) {
					return fb.access(this, function (a, c, d) {
						var e,
						f,
						g = {},
						h = 0;
						if (fb.isArray(c)) {
							for (e = u(a), f = c.length; f > h; h++)
								g[c[h]] = fb.css(a, c[h], !1, e);
							return g
						}
						return d !== b ? fb.style(a, c, d) : fb.css(a, c)
					}, a, c, arguments.length > 1)
				},
				show : function () {
					return v(this, !0)
				},
				hide : function () {
					return v(this)
				},
				toggle : function (a) {
					return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
						t(this) ? fb(this).show() : fb(this).hide()
					})
				}
			}),
			fb.extend({
				cssHooks : {
					opacity : {
						get : function (a, b) {
							if (b) {
								var c = Qb(a, "opacity");
								return "" === c ? "1" : c
							}
						}
					}
				},
				cssNumber : {
					columnCount : !0,
					fillOpacity : !0,
					fontWeight : !0,
					lineHeight : !0,
					opacity : !0,
					order : !0,
					orphans : !0,
					widows : !0,
					zIndex : !0,
					zoom : !0
				},
				cssProps : {
					"float" : "cssFloat"
				},
				style : function (a, c, d, e) {
					if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
						var f,
						g,
						h,
						i = fb.camelCase(c),
						j = a.style;
						return c = fb.cssProps[i] || (fb.cssProps[i] = s(j, i)),
						h = fb.cssHooks[c] || fb.cssHooks[i],
						d === b ? h && "get" in h && (f = h.get(a, !1, e)) !== b ? f : j[c] : (g = typeof d, "string" === g && (f = Wb.exec(d)) && (d = (f[1] + 1) * f[2] + parseFloat(fb.css(a, c)), g = "number"), null == d || "number" === g && isNaN(d) || ("number" !== g || fb.cssNumber[i] || (d += "px"), fb.support.clearCloneStyle || "" !== d || 0 !== c.indexOf("background") || (j[c] = "inherit"), h && "set" in h && (d = h.set(a, d, e)) === b || (j[c] = d)), void 0)
					}
				},
				css : function (a, c, d, e) {
					var f,
					g,
					h,
					i = fb.camelCase(c);
					return c = fb.cssProps[i] || (fb.cssProps[i] = s(a.style, i)),
					h = fb.cssHooks[c] || fb.cssHooks[i],
					h && "get" in h && (f = h.get(a, !0, d)),
					f === b && (f = Qb(a, c, e)),
					"normal" === f && c in Zb && (f = Zb[c]),
					"" === d || d ? (g = parseFloat(f), d === !0 || fb.isNumeric(g) ? g || 0 : f) : f
				}
			}),
			Qb = function (a, c, d) {
				var e,
				f,
				g,
				h = d || u(a),
				i = h ? h.getPropertyValue(c) || h[c] : b,
				j = a.style;
				return h && ("" !== i || fb.contains(a.ownerDocument, a) || (i = fb.style(a, c)), Vb.test(i) && Tb.test(c) && (e = j.width, f = j.minWidth, g = j.maxWidth, j.minWidth = j.maxWidth = j.width = i, i = h.width, j.width = e, j.minWidth = f, j.maxWidth = g)),
				i
			},
			fb.each(["height", "width"], function (a, b) {
				fb.cssHooks[b] = {
					get : function (a, c, d) {
						return c ? 0 === a.offsetWidth && Sb.test(fb.css(a, "display")) ? fb.swap(a, Yb, function () {
							return y(a, b, d)
						}) : y(a, b, d) : void 0
					},
					set : function (a, c, d) {
						var e = d && u(a);
						return w(a, c, d ? x(a, b, d, fb.support.boxSizing && "border-box" === fb.css(a, "boxSizing", !1, e), e) : 0)
					}
				}
			}),
			fb(function () {
				fb.support.reliableMarginRight || (fb.cssHooks.marginRight = {
						get : function (a, b) {
							return b ? fb.swap(a, {
								display : "inline-block"
							}, Qb, [a, "marginRight"]) : void 0
						}
					}),
				!fb.support.pixelPosition && fb.fn.position && fb.each(["top", "left"], function (a, b) {
					fb.cssHooks[b] = {
						get : function (a, c) {
							return c ? (c = Qb(a, b), Vb.test(c) ? fb(a).position()[b] + "px" : c) : void 0
						}
					}
				})
			}),
			fb.expr && fb.expr.filters && (fb.expr.filters.hidden = function (a) {
				return a.offsetWidth <= 0 && a.offsetHeight <= 0
			}, fb.expr.filters.visible = function (a) {
				return !fb.expr.filters.hidden(a)
			}),
			fb.each({
				margin : "",
				padding : "",
				border : "Width"
			}, function (a, b) {
				fb.cssHooks[a + b] = {
					expand : function (c) {
						for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)
							e[a + $b[d] + b] = f[d] || f[d - 2] || f[0];
						return e
					}
				},
				Tb.test(a) || (fb.cssHooks[a + b].set = w)
			});
			var ac = /%20/g,
			bc = /\[\]$/,
			cc = /\r?\n/g,
			dc = /^(?:submit|button|image|reset|file)$/i,
			ec = /^(?:input|select|textarea|keygen)/i;
			fb.fn.extend({
				serialize : function () {
					return fb.param(this.serializeArray())
				},
				serializeArray : function () {
					return this.map(function () {
						var a = fb.prop(this, "elements");
						return a ? fb.makeArray(a) : this
					}).filter(function () {
						var a = this.type;
						return this.name && !fb(this).is(":disabled") && ec.test(this.nodeName) && !dc.test(a) && (this.checked || !Kb.test(a))
					}).map(function (a, b) {
						var c = fb(this).val();
						return null == c ? null : fb.isArray(c) ? fb.map(c, function (a) {
							return {
								name : b.name,
								value : a.replace(cc, "\r\n")
							}
						}) : {
							name : b.name,
							value : c.replace(cc, "\r\n")
						}
					}).get()
				}
			}),
			fb.param = function (a, c) {
				var d,
				e = [],
				f = function (a, b) {
					b = fb.isFunction(b) ? b() : null == b ? "" : b,
					e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
				};
				if (c === b && (c = fb.ajaxSettings && fb.ajaxSettings.traditional), fb.isArray(a) || a.jquery && !fb.isPlainObject(a))
					fb.each(a, function () {
						f(this.name, this.value)
					});
				else
					for (d in a)
						B(d, a[d], c, f);
				return e.join("&").replace(ac, "+")
			},
			fb.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
				fb.fn[b] = function (a, c) {
					return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
				}
			}),
			fb.fn.extend({
				hover : function (a, b) {
					return this.mouseenter(a).mouseleave(b || a)
				},
				bind : function (a, b, c) {
					return this.on(a, null, b, c)
				},
				unbind : function (a, b) {
					return this.off(a, null, b)
				},
				delegate : function (a, b, c, d) {
					return this.on(b, a, c, d)
				},
				undelegate : function (a, b, c) {
					return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
				}
			});
			var fc,
			gc,
			hc = fb.now(),
			ic = /\?/,
			jc = /#.*$/,
			kc = /([?&])_=[^&]*/,
			lc = /^(.*?):[ \t]*([^\r\n]*)$/gm,
			mc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
			nc = /^(?:GET|HEAD)$/,
			oc = /^\/\//,
			pc = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
			qc = fb.fn.load,
			rc = {},
			sc = {},
			tc = "*/".concat("*");
			try {
				gc = S.href
			} catch (uc) {
				gc = T.createElement("a"),
				gc.href = "",
				gc = gc.href
			}
			fc = pc.exec(gc.toLowerCase()) || [],
			fb.fn.load = function (a, c, d) {
				if ("string" != typeof a && qc)
					return qc.apply(this, arguments);
				var e,
				f,
				g,
				h = this,
				i = a.indexOf(" ");
				return i >= 0 && (e = a.slice(i), a = a.slice(0, i)),
				fb.isFunction(c) ? (d = c, c = b) : c && "object" == typeof c && (f = "POST"),
				h.length > 0 && fb.ajax({
					url : a,
					type : f,
					dataType : "html",
					data : c
				}).done(function (a) {
					g = arguments,
					h.html(e ? fb("<div>").append(fb.parseHTML(a)).find(e) : a)
				}).complete(d && function (a, b) {
					h.each(d, g || [a.responseText, b, a])
				}),
				this
			},
			fb.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
				fb.fn[b] = function (a) {
					return this.on(b, a)
				}
			}),
			fb.extend({
				active : 0,
				lastModified : {},
				etag : {},
				ajaxSettings : {
					url : gc,
					type : "GET",
					isLocal : mc.test(fc[1]),
					global : !0,
					processData : !0,
					async : !0,
					contentType : "application/x-www-form-urlencoded; charset=UTF-8",
					accepts : {
						"*" : tc,
						text : "text/plain",
						html : "text/html",
						xml : "application/xml, text/xml",
						json : "application/json, text/javascript"
					},
					contents : {
						xml : /xml/,
						html : /html/,
						json : /json/
					},
					responseFields : {
						xml : "responseXML",
						text : "responseText",
						json : "responseJSON"
					},
					converters : {
						"* text" : String,
						"text html" : !0,
						"text json" : fb.parseJSON,
						"text xml" : fb.parseXML
					},
					flatOptions : {
						url : !0,
						context : !0
					}
				},
				ajaxSetup : function (a, b) {
					return b ? E(E(a, fb.ajaxSettings), b) : E(fb.ajaxSettings, a)
				},
				ajaxPrefilter : C(rc),
				ajaxTransport : C(sc),
				ajax : function (a, c) {
					function d(a, c, d, h) {
						var j,
						l,
						s,
						t,
						v,
						x = c;
						2 !== u && (u = 2, i && clearTimeout(i), e = b, g = h || "", w.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, d && (t = F(m, w, d)), t = G(m, t, w, j), j ? (m.ifModified && (v = w.getResponseHeader("Last-Modified"), v && (fb.lastModified[f] = v), v = w.getResponseHeader("etag"), v && (fb.etag[f] = v)), 204 === a || "HEAD" === m.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = t.state, l = t.data, s = t.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), w.status = a, w.statusText = (c || x) + "", j ? p.resolveWith(n, [l, x, w]) : p.rejectWith(n, [w, x, s]), w.statusCode(r), r = b, k && o.trigger(j ? "ajaxSuccess" : "ajaxError", [w, m, j ? l : s]), q.fireWith(n, [w, x]), k && (o.trigger("ajaxComplete", [w, m]), --fb.active || fb.event.trigger("ajaxStop")))
					}
					"object" == typeof a && (c = a, a = b),
					c = c || {};
					var e,
					f,
					g,
					h,
					i,
					j,
					k,
					l,
					m = fb.ajaxSetup({}, c),
					n = m.context || m,
					o = m.context && (n.nodeType || n.jquery) ? fb(n) : fb.event,
					p = fb.Deferred(),
					q = fb.Callbacks("once memory"),
					r = m.statusCode || {},
					s = {},
					t = {},
					u = 0,
					v = "canceled",
					w = {
						readyState : 0,
						getResponseHeader : function (a) {
							var b;
							if (2 === u) {
								if (!h)
									for (h = {}; b = lc.exec(g); )
										h[b[1].toLowerCase()] = b[2];
								b = h[a.toLowerCase()]
							}
							return null == b ? null : b
						},
						getAllResponseHeaders : function () {
							return 2 === u ? g : null
						},
						setRequestHeader : function (a, b) {
							var c = a.toLowerCase();
							return u || (a = t[c] = t[c] || a, s[a] = b),
							this
						},
						overrideMimeType : function (a) {
							return u || (m.mimeType = a),
							this
						},
						statusCode : function (a) {
							var b;
							if (a)
								if (2 > u)
									for (b in a)
										r[b] = [r[b], a[b]];
								else
									w.always(a[w.status]);
							return this
						},
						abort : function (a) {
							var b = a || v;
							return e && e.abort(b),
							d(0, b),
							this
						}
					};
					if (p.promise(w).complete = q.add, w.success = w.done, w.error = w.fail, m.url = ((a || m.url || gc) + "").replace(jc, "").replace(oc, fc[1] + "//"), m.type = c.method || c.type || m.method || m.type, m.dataTypes = fb.trim(m.dataType || "*").toLowerCase().match(hb) || [""], null == m.crossDomain && (j = pc.exec(m.url.toLowerCase()), m.crossDomain = !(!j || j[1] === fc[1] && j[2] === fc[2] && (j[3] || ("http:" === j[1] ? "80" : "443")) === (fc[3] || ("http:" === fc[1] ? "80" : "443")))), m.data && m.processData && "string" != typeof m.data && (m.data = fb.param(m.data, m.traditional)), D(rc, m, c, w), 2 === u)
						return w;
					k = m.global,
					k && 0 === fb.active++ && fb.event.trigger("ajaxStart"),
					m.type = m.type.toUpperCase(),
					m.hasContent = !nc.test(m.type),
					f = m.url,
					m.hasContent || (m.data && (f = m.url += (ic.test(f) ? "&" : "?") + m.data, delete m.data), m.cache === !1 && (m.url = kc.test(f) ? f.replace(kc, "$1_=" + hc++) : f + (ic.test(f) ? "&" : "?") + "_=" + hc++)),
					m.ifModified && (fb.lastModified[f] && w.setRequestHeader("If-Modified-Since", fb.lastModified[f]), fb.etag[f] && w.setRequestHeader("If-None-Match", fb.etag[f])),
					(m.data && m.hasContent && m.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", m.contentType),
					w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + tc + "; q=0.01" : "") : m.accepts["*"]);
					for (l in m.headers)
						w.setRequestHeader(l, m.headers[l]);
					if (m.beforeSend && (m.beforeSend.call(n, w, m) === !1 || 2 === u))
						return w.abort();
					v = "abort";
					for (l in {
						success : 1,
						error : 1,
						complete : 1
					})
						w[l](m[l]);
					if (e = D(sc, m, c, w)) {
						w.readyState = 1,
						k && o.trigger("ajaxSend", [w, m]),
						m.async && m.timeout > 0 && (i = setTimeout(function () {
									w.abort("timeout")
								}, m.timeout));
						try {
							u = 1,
							e.send(s, d)
						} catch (x) {
							if (!(2 > u))
								throw x;
							d(-1, x)
						}
					} else
						d(-1, "No Transport");
					return w
				},
				getJSON : function (a, b, c) {
					return fb.get(a, b, c, "json")
				},
				getScript : function (a, c) {
					return fb.get(a, b, c, "script")
				}
			}),
			fb.each(["get", "post"], function (a, c) {
				fb[c] = function (a, d, e, f) {
					return fb.isFunction(d) && (f = f || e, e = d, d = b),
					fb.ajax({
						url : a,
						type : c,
						dataType : f,
						data : d,
						success : e
					})
				}
			}),
			fb.ajaxSetup({
				accepts : {
					script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
				},
				contents : {
					script : /(?:java|ecma)script/
				},
				converters : {
					"text script" : function (a) {
						return fb.globalEval(a),
						a
					}
				}
			}),
			fb.ajaxPrefilter("script", function (a) {
				a.cache === b && (a.cache = !1),
				a.crossDomain && (a.type = "GET")
			}),
			fb.ajaxTransport("script", function (a) {
				if (a.crossDomain) {
					var b,
					c;
					return {
						send : function (d, e) {
							b = fb("<script>").prop({
									async : !0,
									charset : a.scriptCharset,
									src : a.url
								}).on("load error", c = function (a) {
									b.remove(),
									c = null,
									a && e("error" === a.type ? 404 : 200, a.type)
								}),
							T.head.appendChild(b[0])
						},
						abort : function () {
							c && c()
						}
					}
				}
			});
			var vc = [],
			wc = /(=)\?(?=&|$)|\?\?/;
			fb.ajaxSetup({
				jsonp : "callback",
				jsonpCallback : function () {
					var a = vc.pop() || fb.expando + "_" + hc++;
					return this[a] = !0,
					a
				}
			}),
			fb.ajaxPrefilter("json jsonp", function (c, d, e) {
				var f,
				g,
				h,
				i = c.jsonp !== !1 && (wc.test(c.url) ? "url" : "string" == typeof c.data && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && wc.test(c.data) && "data");
				return i || "jsonp" === c.dataTypes[0] ? (f = c.jsonpCallback = fb.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, i ? c[i] = c[i].replace(wc, "$1" + f) : c.jsonp !== !1 && (c.url += (ic.test(c.url) ? "&" : "?") + c.jsonp + "=" + f), c.converters["script json"] = function () {
					return h || fb.error(f + " was not called"),
					h[0]
				}, c.dataTypes[0] = "json", g = a[f], a[f] = function () {
					h = arguments
				}, e.always(function () {
						a[f] = g,
						c[f] && (c.jsonpCallback = d.jsonpCallback, vc.push(f)),
						h && fb.isFunction(g) && g(h[0]),
						h = g = b
					}), "script") : void 0
			}),
			fb.ajaxSettings.xhr = function () {
				try {
					return new XMLHttpRequest
				} catch (a) {}

			};
			var xc = fb.ajaxSettings.xhr(),
			yc = {
				0 : 200,
				1223 : 204
			},
			zc = 0,
			Ac = {};
			a.ActiveXObject && fb(a).on("unload", function () {
				for (var a in Ac)
					Ac[a]();
				Ac = b
			}),
			fb.support.cors = !!xc && "withCredentials" in xc,
			fb.support.ajax = xc = !!xc,
			fb.ajaxTransport(function (a) {
				var c;
				return fb.support.cors || xc && !a.crossDomain ? {
					send : function (d, e) {
						var f,
						g,
						h = a.xhr();
						if (h.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
							for (f in a.xhrFields)
								h[f] = a.xhrFields[f];
						a.mimeType && h.overrideMimeType && h.overrideMimeType(a.mimeType),
						a.crossDomain || d["X-Requested-With"] || (d["X-Requested-With"] = "XMLHttpRequest");
						for (f in d)
							h.setRequestHeader(f, d[f]);
						c = function (a) {
							return function () {
								c && (delete Ac[g], c = h.onload = h.onerror = null, "abort" === a ? h.abort() : "error" === a ? e(h.status || 404, h.statusText) : e(yc[h.status] || h.status, h.statusText, "string" == typeof h.responseText ? {
										text : h.responseText
									}
										 : b, h.getAllResponseHeaders()))
							}
						},
						h.onload = c(),
						h.onerror = c("error"),
						c = Ac[g = zc++] = c("abort"),
						h.send(a.hasContent && a.data || null)
					},
					abort : function () {
						c && c()
					}
				}
				 : void 0
			});
			var Bc,
			Cc,
			Dc = /^(?:toggle|show|hide)$/,
			Ec = new RegExp("^(?:([+-])=|)(" + gb + ")([a-z%]*)$", "i"),
			Fc = /queueHooks$/,
			Gc = [L],
			Hc = {
				"*" : [function (a, b) {
						var c = this.createTween(a, b),
						d = c.cur(),
						e = Ec.exec(b),
						f = e && e[3] || (fb.cssNumber[a] ? "" : "px"),
						g = (fb.cssNumber[a] || "px" !== f && +d) && Ec.exec(fb.css(c.elem, a)),
						h = 1,
						i = 20;
						if (g && g[3] !== f) {
							f = f || g[3],
							e = e || [],
							g = +d || 1;
							do
								h = h || ".5", g /= h, fb.style(c.elem, a, g + f);
							while (h !== (h = c.cur() / d) && 1 !== h && --i)
						}
						return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]),
						c
					}
				]
			};
			fb.Animation = fb.extend(J, {
					tweener : function (a, b) {
						fb.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
						for (var c, d = 0, e = a.length; e > d; d++)
							c = a[d], Hc[c] = Hc[c] || [], Hc[c].unshift(b)
					},
					prefilter : function (a, b) {
						b ? Gc.unshift(a) : Gc.push(a)
					}
				}),
			fb.Tween = M,
			M.prototype = {
				constructor : M,
				init : function (a, b, c, d, e, f) {
					this.elem = a,
					this.prop = c,
					this.easing = e || "swing",
					this.options = b,
					this.start = this.now = this.cur(),
					this.end = d,
					this.unit = f || (fb.cssNumber[c] ? "" : "px")
				},
				cur : function () {
					var a = M.propHooks[this.prop];
					return a && a.get ? a.get(this) : M.propHooks._default.get(this)
				},
				run : function (a) {
					var b,
					c = M.propHooks[this.prop];
					return this.pos = b = this.options.duration ? fb.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a,
					this.now = (this.end - this.start) * b + this.start,
					this.options.step && this.options.step.call(this.elem, this.now, this),
					c && c.set ? c.set(this) : M.propHooks._default.set(this),
					this
				}
			},
			M.prototype.init.prototype = M.prototype,
			M.propHooks = {
				_default : {
					get : function (a) {
						var b;
						return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = fb.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
					},
					set : function (a) {
						fb.fx.step[a.prop] ? fb.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[fb.cssProps[a.prop]] || fb.cssHooks[a.prop]) ? fb.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
					}
				}
			},
			M.propHooks.scrollTop = M.propHooks.scrollLeft = {
				set : function (a) {
					a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
				}
			},
			fb.each(["toggle", "show", "hide"], function (a, b) {
				var c = fb.fn[b];
				fb.fn[b] = function (a, d, e) {
					return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(N(b, !0), a, d, e)
				}
			}),
			fb.fn.extend({
				fadeTo : function (a, b, c, d) {
					return this.filter(t).css("opacity", 0).show().end().animate({
						opacity : b
					}, a, c, d)
				},
				animate : function (a, b, c, d) {
					var e = fb.isEmptyObject(a),
					f = fb.speed(b, c, d),
					g = function () {
						var b = J(this, fb.extend({}, a), f);
						(e || qb.get(this, "finish")) && b.stop(!0)
					};
					return g.finish = g,
					e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
				},
				stop : function (a, c, d) {
					var e = function (a) {
						var b = a.stop;
						delete a.stop,
						b(d)
					};
					return "string" != typeof a && (d = c, c = a, a = b),
					c && a !== !1 && this.queue(a || "fx", []),
					this.each(function () {
						var b = !0,
						c = null != a && a + "queueHooks",
						f = fb.timers,
						g = qb.get(this);
						if (c)
							g[c] && g[c].stop && e(g[c]);
						else
							for (c in g)
								g[c] && g[c].stop && Fc.test(c) && e(g[c]);
						for (c = f.length; c--; )
							f[c].elem !== this || null != a && f[c].queue !== a || (f[c].anim.stop(d), b = !1, f.splice(c, 1));
						(b || !d) && fb.dequeue(this, a)
					})
				},
				finish : function (a) {
					return a !== !1 && (a = a || "fx"),
					this.each(function () {
						var b,
						c = qb.get(this),
						d = c[a + "queue"],
						e = c[a + "queueHooks"],
						f = fb.timers,
						g = d ? d.length : 0;
						for (c.finish = !0, fb.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--; )
							f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
						for (b = 0; g > b; b++)
							d[b] && d[b].finish && d[b].finish.call(this);
						delete c.finish
					})
				}
			}),
			fb.each({
				slideDown : N("show"),
				slideUp : N("hide"),
				slideToggle : N("toggle"),
				fadeIn : {
					opacity : "show"
				},
				fadeOut : {
					opacity : "hide"
				},
				fadeToggle : {
					opacity : "toggle"
				}
			}, function (a, b) {
				fb.fn[a] = function (a, c, d) {
					return this.animate(b, a, c, d)
				}
			}),
			fb.speed = function (a, b, c) {
				var d = a && "object" == typeof a ? fb.extend({}, a) : {
					complete : c || !c && b || fb.isFunction(a) && a,
					duration : a,
					easing : c && b || b && !fb.isFunction(b) && b
				};
				return d.duration = fb.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in fb.fx.speeds ? fb.fx.speeds[d.duration] : fb.fx.speeds._default,
				(null == d.queue || d.queue === !0) && (d.queue = "fx"),
				d.old = d.complete,
				d.complete = function () {
					fb.isFunction(d.old) && d.old.call(this),
					d.queue && fb.dequeue(this, d.queue)
				},
				d
			},
			fb.easing = {
				linear : function (a) {
					return a
				},
				swing : function (a) {
					return .5 - Math.cos(a * Math.PI) / 2
				}
			},
			fb.timers = [],
			fb.fx = M.prototype.init,
			fb.fx.tick = function () {
				var a,
				c = fb.timers,
				d = 0;
				for (Bc = fb.now(); d < c.length; d++)
					a = c[d], a() || c[d] !== a || c.splice(d--, 1);
				c.length || fb.fx.stop(),
				Bc = b
			},
			fb.fx.timer = function (a) {
				a() && fb.timers.push(a) && fb.fx.start()
			},
			fb.fx.interval = 13,
			fb.fx.start = function () {
				Cc || (Cc = setInterval(fb.fx.tick, fb.fx.interval))
			},
			fb.fx.stop = function () {
				clearInterval(Cc),
				Cc = null
			},
			fb.fx.speeds = {
				slow : 600,
				fast : 200,
				_default : 400
			},
			fb.fx.step = {},
			fb.expr && fb.expr.filters && (fb.expr.filters.animated = function (a) {
				return fb.grep(fb.timers, function (b) {
					return a === b.elem
				}).length
			}),
			fb.fn.offset = function (a) {
				if (arguments.length)
					return a === b ? this : this.each(function (b) {
						fb.offset.setOffset(this, a, b)
					});
				var c,
				d,
				e = this[0],
				f = {
					top : 0,
					left : 0
				},
				g = e && e.ownerDocument;
				if (g)
					return c = g.documentElement, fb.contains(c, e) ? (typeof e.getBoundingClientRect !== R && (f = e.getBoundingClientRect()), d = O(g), {
						top : f.top + d.pageYOffset - c.clientTop,
						left : f.left + d.pageXOffset - c.clientLeft
					}) : f
			},
			fb.offset = {
				setOffset : function (a, b, c) {
					var d,
					e,
					f,
					g,
					h,
					i,
					j,
					k = fb.css(a, "position"),
					l = fb(a),
					m = {};
					"static" === k && (a.style.position = "relative"),
					h = l.offset(),
					f = fb.css(a, "top"),
					i = fb.css(a, "left"),
					j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1,
					j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0),
					fb.isFunction(b) && (b = b.call(a, c, h)),
					null != b.top && (m.top = b.top - h.top + g),
					null != b.left && (m.left = b.left - h.left + e),
					"using" in b ? b.using.call(a, m) : l.css(m)
				}
			},
			fb.fn.extend({
				position : function () {
					if (this[0]) {
						var a,
						b,
						c = this[0],
						d = {
							top : 0,
							left : 0
						};
						return "fixed" === fb.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), fb.nodeName(a[0], "html") || (d = a.offset()), d.top += fb.css(a[0], "borderTopWidth", !0), d.left += fb.css(a[0], "borderLeftWidth", !0)), {
							top : b.top - d.top - fb.css(c, "marginTop", !0),
							left : b.left - d.left - fb.css(c, "marginLeft", !0)
						}
					}
				},
				offsetParent : function () {
					return this.map(function () {
						for (var a = this.offsetParent || U; a && !fb.nodeName(a, "html") && "static" === fb.css(a, "position"); )
							a = a.offsetParent;
						return a || U
					})
				}
			}),
			fb.each({
				scrollLeft : "pageXOffset",
				scrollTop : "pageYOffset"
			}, function (c, d) {
				var e = "pageYOffset" === d;
				fb.fn[c] = function (f) {
					return fb.access(this, function (c, f, g) {
						var h = O(c);
						return g === b ? h ? h[d] : c[f] : (h ? h.scrollTo(e ? a.pageXOffset : g, e ? g : a.pageYOffset) : c[f] = g, void 0)
					}, c, f, arguments.length, null)
				}
			}),
			fb.each({
				Height : "height",
				Width : "width"
			}, function (a, c) {
				fb.each({
					padding : "inner" + a,
					content : c,
					"" : "outer" + a
				}, function (d, e) {
					fb.fn[e] = function (e, f) {
						var g = arguments.length && (d || "boolean" != typeof e),
						h = d || (e === !0 || f === !0 ? "margin" : "border");
						return fb.access(this, function (c, d, e) {
							var f;
							return fb.isWindow(c) ? c.document.documentElement["client" + a] : 9 === c.nodeType ? (f = c.documentElement, Math.max(c.body["scroll" + a], f["scroll" + a], c.body["offset" + a], f["offset" + a], f["client" + a])) : e === b ? fb.css(c, d, h) : fb.style(c, d, e, h)
						}, c, g ? e : b, g, null)
					}
				})
			}),
			fb.fn.size = function () {
				return this.length
			},
			fb.fn.andSelf = fb.fn.addBack,
			"object" == typeof module && module && "object" == typeof module.exports ? module.exports = fb : "function" == typeof define && define.amd && define("jquery", [], function () {
					return fb
				}),
			"object" == typeof a && "object" == typeof a.document && (a.jQuery = a.$ = fb)
		}
			(window), function (a, b, c) {
			function d(a, b, c) {
				for (var d = [], e = 0; e < a.length; e++) {
					var f = tinycolor(a[e]),
					g = f.toHsl().l < .5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
					g += tinycolor.equals(b, a[e]) ? " sp-thumb-active" : "";
					var h = q ? "background-color:" + f.toRgbString() : "filter:" + f.toFilter();
					d.push('<span title="' + f.toRgbString() + '" data-color="' + f.toRgbString() + '" class="' + g + '"><span class="sp-thumb-inner" style="' + h + ';" /></span>')
				}
				return "<div class='sp-cf " + c + "'>" + d.join("") + "</div>"
			}
			function e() {
				for (var a = 0; a < o.length; a++)
					o[a] && o[a].hide()
			}
			function f(a, c) {
				var d = b.extend({}, n, a);
				return d.callbacks = {
					move : k(d.move, c),
					change : k(d.change, c),
					show : k(d.show, c),
					hide : k(d.hide, c),
					beforeShow : k(d.beforeShow, c)
				},
				d
			}
			function g(g, i) {
				function k() {
					qb.toggleClass("sp-flat", R),
					qb.toggleClass("sp-input-disabled", !Q.showInput),
					qb.toggleClass("sp-alpha-enabled", Q.showAlpha),
					qb.toggleClass("sp-buttons-disabled", !Q.showButtons || R),
					qb.toggleClass("sp-palette-disabled", !Q.showPalette),
					qb.toggleClass("sp-palette-only", Q.showPaletteOnly),
					qb.toggleClass("sp-initial-disabled", !Q.showInitial),
					qb.addClass(Q.className),
					L()
				}
				function n() {
					function c(a) {
						return a.data && a.data.ignore ? (E(b(this).data("color")), H()) : (E(b(this).data("color")), K(!0), H(), C()),
						!1
					}
					if (p && qb.find("*:not(input)").attr("unselectable", "on"), k(), Eb && ob.after(Fb).hide(), R)
						ob.after(qb).hide();
					else {
						var d = "parent" === Q.appendTo ? ob.parent() : b(Q.appendTo);
						1 !== d.length && (d = b("body")),
						d.append(qb)
					}
					if (T && a.localStorage) {
						try {
							var e = a.localStorage[T].split(",#");
							e.length > 1 && (delete a.localStorage[T], b.each(e, function (a, b) {
									t(b)
								}))
						} catch (f) {}

						try {
							kb = a.localStorage[T].split(";")
						} catch (f) {}

					}
					Gb.bind("click.spectrum touchstart.spectrum", function (a) {
						pb || A(),
						a.stopPropagation(),
						b(a.target).is("input") || a.preventDefault()
					}),
					(ob.is(":disabled") || Q.disabled === !0) && P(),
					qb.click(j),
					yb.change(z),
					yb.bind("paste", function () {
						setTimeout(z, 1)
					}),
					yb.keydown(function (a) {
						13 == a.keyCode && z()
					}),
					Bb.text(Q.cancelText),
					Bb.bind("click.spectrum", function (a) {
						a.stopPropagation(),
						a.preventDefault(),
						C("cancel")
					}),
					Cb.text(Q.chooseText),
					Cb.bind("click.spectrum", function (a) {
						a.stopPropagation(),
						a.preventDefault(),
						G() && (K(!0), C())
					}),
					l(wb, function (a, b, c) {
						hb = a / bb,
						c.shiftKey && (hb = Math.round(10 * hb) / 10),
						H()
					}),
					l(tb, function (a, b) {
						eb = parseFloat(b / _),
						H()
					}, x, y),
					l(rb, function (a, b) {
						fb = parseFloat(a / Y),
						gb = parseFloat((Z - b) / Z),
						H()
					}, x, y),
					Ib ? (E(Ib), I(), Lb = Kb || tinycolor(Ib).format, t(Ib)) : I(),
					R && B();
					var g = p ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
					zb.delegate(".sp-thumb-el", g, c),
					Ab.delegate(".sp-thumb-el:nth-child(1)", g, {
						ignore : !0
					}, c)
				}
				function t(c) {
					if (S) {
						var d = tinycolor(c).toRgbString();
						if (-1 === b.inArray(d, kb))
							for (kb.push(d); kb.length > lb; )
								kb.shift();
						if (T && a.localStorage)
							try {
								a.localStorage[T] = kb.join(";")
							} catch (e) {}

					}
				}
				function u() {
					var a,
					b = [],
					c = kb,
					d = {};
					if (Q.showPalette) {
						for (var e = 0; e < jb.length; e++)
							for (var f = 0; f < jb[e].length; f++)
								a = tinycolor(jb[e][f]).toRgbString(), d[a] = !0;
						for (e = 0; e < c.length; e++)
							a = tinycolor(c[e]).toRgbString(), d.hasOwnProperty(a) || (b.push(c[e]), d[a] = !0)
					}
					return b.reverse().slice(0, Q.maxSelectionSize)
				}
				function v() {
					var a = F(),
					c = b.map(jb, function (b, c) {
							return d(b, a, "sp-palette-row sp-palette-row-" + c)
						});
					kb && c.push(d(u(), a, "sp-palette-row sp-palette-row-selection")),
					zb.html(c.join(""))
				}
				function w() {
					if (Q.showInitial) {
						var a = Jb,
						b = F();
						Ab.html(d([a, b], b, "sp-palette-row-initial"))
					}
				}
				function x() {
					(0 >= Z || 0 >= Y || 0 >= _) && L(),
					qb.addClass(mb)
				}
				function y() {
					qb.removeClass(mb)
				}
				function z() {
					var a = tinycolor(yb.val());
					a.ok ? E(a) : yb.addClass("sp-validation-error")
				}
				function A() {
					X ? C() : B()
				}
				function B() {
					var c = b.Event("beforeShow.spectrum");
					return X ? (L(), void 0) : (ob.trigger(c, [F()]), V.beforeShow(F()) === !1 || c.isDefaultPrevented() || (e(), X = !0, b(nb).bind("click.spectrum", C), b(a).bind("resize.spectrum", W), Fb.addClass("sp-active"), qb.removeClass("sp-hidden"), Q.showPalette && v(), L(), I(), Jb = F(), w(), V.show(Jb), ob.trigger("show.spectrum", [Jb])), void 0)
				}
				function C(c) {
					if ((!c || "click" != c.type || 2 != c.button) && X && !R) {
						X = !1,
						b(nb).unbind("click.spectrum", C),
						b(a).unbind("resize.spectrum", W),
						Fb.removeClass("sp-active"),
						qb.addClass("sp-hidden");
						var d = !tinycolor.equals(F(), Jb);
						d && (Mb && "cancel" !== c ? K(!0) : D()),
						V.hide(F()),
						ob.trigger("hide.spectrum", [F()])
					}
				}
				function D() {
					E(Jb, !0)
				}
				function E(a, b) {
					if (!tinycolor.equals(a, F())) {
						var c = tinycolor(a),
						d = c.toHsv();
						eb = d.h,
						fb = d.s,
						gb = d.v,
						hb = d.a,
						I(),
						c.ok && !b && (Lb = Kb || c.format)
					}
				}
				function F(a) {
					return a = a || {},
					tinycolor.fromRatio({
						h : eb,
						s : fb,
						v : gb,
						a : Math.round(100 * hb) / 100
					}, {
						format : a.format || Lb
					})
				}
				function G() {
					return !yb.hasClass("sp-validation-error")
				}
				function H() {
					I(),
					V.move(F()),
					ob.trigger("move.spectrum", [F()])
				}
				function I() {
					yb.removeClass("sp-validation-error"),
					J();
					var a = tinycolor.fromRatio({
							h : eb,
							s : 1,
							v : 1
						});
					rb.css("background-color", a.toHexString());
					var b = Lb;
					1 > hb && ("hex" === b || "hex3" === b || "hex6" === b || "name" === b) && (b = "rgb");
					var c = F({
							format : b
						}),
					d = c.toHexString(),
					e = c.toRgbString();
					if (q || 1 === c.alpha ? Hb.css("background-color", e) : (Hb.css("background-color", "transparent"), Hb.css("filter", c.toFilter())), Q.showAlpha) {
						var f = c.toRgb();
						f.a = 0;
						var g = tinycolor(f).toRgbString(),
						h = "linear-gradient(left, " + g + ", " + d + ")";
						p ? vb.css("filter", tinycolor(g).toFilter({
								gradientType : 1
							}, d)) : (vb.css("background", "-webkit-" + h), vb.css("background", "-moz-" + h), vb.css("background", "-ms-" + h), vb.css("background", h))
					}
					Q.showInput && yb.val(c.toString(b)),
					Q.showPalette && v(),
					w()
				}
				function J() {
					var a = fb,
					b = gb,
					c = a * Y,
					d = Z - b * Z;
					c = Math.max(-$, Math.min(Y - $, c - $)),
					d = Math.max(-$, Math.min(Z - $, d - $)),
					sb.css({
						top : d,
						left : c
					});
					var e = hb * bb;
					xb.css({
						left : e - cb / 2
					});
					var f = eb * _;
					ub.css({
						top : f - db
					})
				}
				function K(a) {
					var b = F();
					Db && ob.val(b.toString(Lb)).change();
					var c = !tinycolor.equals(b, Jb);
					Jb = b,
					t(b),
					a && c && (V.change(b), ob.trigger("change.spectrum", [b]))
				}
				function L() {
					Y = rb.width(),
					Z = rb.height(),
					$ = sb.height(),
					ab = tb.width(),
					_ = tb.height(),
					db = ub.height(),
					bb = wb.width(),
					cb = xb.width(),
					R || (qb.css("position", "absolute"), qb.offset(h(qb, Gb))),
					J()
				}
				function M() {
					ob.show(),
					Gb.unbind("click.spectrum touchstart.spectrum"),
					qb.remove(),
					Fb.remove(),
					o[Nb.id] = null
				}
				function N(a, d) {
					return a === c ? b.extend({}, Q) : d === c ? Q[a] : (Q[a] = d, k(), void 0)
				}
				function O() {
					pb = !1,
					ob.attr("disabled", !1),
					Gb.removeClass("sp-disabled")
				}
				function P() {
					C(),
					pb = !0,
					ob.attr("disabled", !0),
					Gb.addClass("sp-disabled")
				}
				var Q = f(i, g),
				R = Q.flat,
				S = Q.showSelectionPalette,
				T = Q.localStorageKey,
				U = Q.theme,
				V = Q.callbacks,
				W = m(L, 10),
				X = !1,
				Y = 0,
				Z = 0,
				$ = 0,
				_ = 0,
				ab = 0,
				bb = 0,
				cb = 0,
				db = 0,
				eb = 0,
				fb = 0,
				gb = 0,
				hb = 1,
				ib = Q.palette.slice(0),
				jb = b.isArray(ib[0]) ? ib : [ib],
				kb = Q.selectionPalette.slice(0),
				lb = Q.maxSelectionSize,
				mb = "sp-dragging",
				nb = g.ownerDocument,
				ob = (nb.body, b(g)),
				pb = !1,
				qb = b(s, nb).addClass(U),
				rb = qb.find(".sp-color"),
				sb = qb.find(".sp-dragger"),
				tb = qb.find(".sp-hue"),
				ub = qb.find(".sp-slider"),
				vb = qb.find(".sp-alpha-inner"),
				wb = qb.find(".sp-alpha"),
				xb = qb.find(".sp-alpha-handle"),
				yb = qb.find(".sp-input"),
				zb = qb.find(".sp-palette"),
				Ab = qb.find(".sp-initial"),
				Bb = qb.find(".sp-cancel"),
				Cb = qb.find(".sp-choose"),
				Db = ob.is("input"),
				Eb = Db && !R,
				Fb = Eb ? b(r).addClass(U).addClass(Q.className) : b([]),
				Gb = Eb ? Fb : ob,
				Hb = Fb.find(".sp-preview-inner"),
				Ib = Q.color || Db && ob.val(),
				Jb = !1,
				Kb = Q.preferredFormat,
				Lb = Kb,
				Mb = !Q.showButtons || Q.clickoutFiresChange;
				n();
				var Nb = {
					show : B,
					hide : C,
					toggle : A,
					reflow : L,
					option : N,
					enable : O,
					disable : P,
					set : function (a) {
						E(a),
						K()
					},
					get : F,
					destroy : M,
					container : qb
				};
				return Nb.id = o.push(Nb) - 1,
				Nb
			}
			function h(a, c) {
				var d = 0,
				e = a.outerWidth(),
				f = a.outerHeight(),
				g = c.outerHeight(),
				h = a[0].ownerDocument,
				i = h.documentElement,
				j = i.clientWidth + b(h).scrollLeft(),
				k = i.clientHeight + b(h).scrollTop(),
				l = c.offset();
				return l.top += g,
				l.left -= Math.min(l.left, l.left + e > j && j > e ? Math.abs(l.left + e - j) : 0),
				l.top -= Math.min(l.top, l.top + f > k && k > f ? Math.abs(f + g - d) : d),
				l
			}
			function i() {}

			function j(a) {
				a.stopPropagation()
			}
			function k(a, b) {
				var c = Array.prototype.slice,
				d = c.call(arguments, 2);
				return function () {
					return a.apply(b, d.concat(c.call(arguments)))
				}
			}
			function l(c, d, e, f) {
				function g(a) {
					a.stopPropagation && a.stopPropagation(),
					a.preventDefault && a.preventDefault(),
					a.returnValue = !1
				}
				function h(a) {
					if (l) {
						if (p && document.documentMode < 9 && !a.button)
							return j();
						var b = a.originalEvent.touches,
						e = b ? b[0].pageX : a.pageX,
						f = b ? b[0].pageY : a.pageY,
						h = Math.max(0, Math.min(e - m.left, o)),
						i = Math.max(0, Math.min(f - m.top, n));
						q && g(a),
						d.apply(c, [h, i, a])
					}
				}
				function i(a) {
					var d = a.which ? 3 == a.which : 2 == a.button;
					a.originalEvent.touches,
					d || l || e.apply(c, arguments) !== !1 && (l = !0, n = b(c).height(), o = b(c).width(), m = b(c).offset(), b(k).bind(r), b(k.body).addClass("sp-dragging"), q || h(a), g(a))
				}
				function j() {
					l && (b(k).unbind(r), b(k.body).removeClass("sp-dragging"), f.apply(c, arguments)),
					l = !1
				}
				d = d || function () {},
				e = e || function () {},
				f = f || function () {};
				var k = c.ownerDocument || document,
				l = !1,
				m = {},
				n = 0,
				o = 0,
				q = "ontouchstart" in a,
				r = {};
				r.selectstart = g,
				r.dragstart = g,
				r[q ? "touchmove" : "mousemove"] = h,
				r[q ? "touchend" : "mouseup"] = j,
				b(c).bind(q ? "touchstart" : "mousedown", i)
			}
			function m(a, b, c) {
				var d;
				return function () {
					var e = this,
					f = arguments,
					g = function () {
						d = null,
						a.apply(e, f)
					};
					c && clearTimeout(d),
					(c || !d) && (d = setTimeout(g, b))
				}
			}
			var n = {
				beforeShow : i,
				move : i,
				change : i,
				show : i,
				hide : i,
				color : !1,
				flat : !1,
				showInput : !1,
				showButtons : !0,
				clickoutFiresChange : !1,
				showInitial : !1,
				showPalette : !1,
				showPaletteOnly : !1,
				showSelectionPalette : !0,
				localStorageKey : !1,
				appendTo : "body",
				maxSelectionSize : 7,
				cancelText : "cancel",
				chooseText : "choose",
				preferredFormat : !1,
				className : "",
				showAlpha : !1,
				theme : "sp-light",
				palette : ["fff", "000"],
				selectionPalette : [],
				disabled : !1
			},
			o = [],
			p = !!/msie/i.exec(a.navigator.userAgent),
			q = function () {
				function a(a, b) {
					return !!~("" + a).indexOf(b)
				}
				var b = document.createElement("div"),
				c = b.style;
				return c.cssText = "background-color:rgba(0,0,0,.5)",
				a(c.backgroundColor, "rgba") || a(c.backgroundColor, "hsla")
			}
			(),
			r = ["<div class='sp-replacer'>", "<div class='sp-preview'><div class='sp-preview-inner'></div></div>", "<div class='sp-dd'>&#9660;</div>", "</div>"].join(""),
			s = function () {
				var a = "";
				if (p)
					for (var b = 1; 6 >= b; b++)
						a += "<div class='sp-" + b + "'></div>";
				return ["<div class='sp-container sp-hidden'>", "<div class='sp-palette-container'>", "<div class='sp-palette sp-thumb sp-cf'></div>", "</div>", "<div class='sp-picker-container'>", "<div class='sp-top sp-cf'>", "<div class='sp-fill'></div>", "<div class='sp-top-inner'>", "<div class='sp-color'>", "<div class='sp-sat'>", "<div class='sp-val'>", "<div class='sp-dragger'></div>", "</div>", "</div>", "</div>", "<div class='sp-hue'>", "<div class='sp-slider'></div>", a, "</div>", "</div>", "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>", "</div>", "<div class='sp-input-container sp-cf'>", "<input class='sp-input' type='text' spellcheck='false'  />", "</div>", "<div class='sp-initial sp-thumb sp-cf'></div>", "</div>", "</div>"].join("")
			}
			(),
			t = function () {};
			a.console && (t = Function.prototype.bind ? Function.prototype.bind.call(console.log, console) : function () {
				Function.prototype.apply.call(console.log, console, arguments)
			});
			var u = "spectrum.id";
			b.fn.spectrum = function (a) {
				if ("string" == typeof a) {
					var c = this,
					d = Array.prototype.slice.call(arguments, 1);
					return this.each(function () {
						var e = o[b(this).data(u)];
						if (e) {
							var f = e[a];
							if (!f)
								throw new Error("Spectrum: no such method: '" + a + "'");
							"get" == a ? c = e.get() : "container" == a ? c = e.container : "option" == a ? c = e.option.apply(e, d) : "destroy" == a ? (e.destroy(), b(this).removeData(u)) : f.apply(e, d)
						}
					}),
					c
				}
				return this.spectrum("destroy").each(function () {
					var c = g(this, a);
					b(this).data(u, c.id)
				})
			},
			b.fn.spectrum.load = !0,
			b.fn.spectrum.loadOpts = {},
			b.fn.spectrum.draggable = l,
			b.fn.spectrum.defaults = n,
			b.spectrum = {},
			b.spectrum.localization = {},
			b.spectrum.palettes = {},
			b.fn.spectrum.processNativeColorInputs = function () {
				var a = b("<input type='color' value='!' />")[0],
				c = "color" === a.type && "!" != a.value;
				c || b("input[type=color]").spectrum({
					preferredFormat : "hex6"
				})
			},
			function (a) {
				function b(a, d) {
					if (a = a ? a : "", d = d || {}, "object" == typeof a && a.hasOwnProperty("_tc_id"))
						return a;
					var f = c(a),
					h = f.r,
					j = f.g,
					l = f.b,
					m = f.a,
					n = w(100 * m) / 100,
					o = d.format || f.format;
					return 1 > h && (h = w(h)),
					1 > j && (j = w(j)),
					1 > l && (l = w(l)), {
						ok : f.ok,
						format : o,
						_tc_id : u++,
						alpha : m,
						toHsv : function () {
							var a = g(h, j, l);
							return {
								h : 360 * a.h,
								s : a.s,
								v : a.v,
								a : m
							}
						},
						toHsvString : function () {
							var a = g(h, j, l),
							b = w(360 * a.h),
							c = w(100 * a.s),
							d = w(100 * a.v);
							return 1 == m ? "hsv(" + b + ", " + c + "%, " + d + "%)" : "hsva(" + b + ", " + c + "%, " + d + "%, " + n + ")"
						},
						toHsl : function () {
							var a = e(h, j, l);
							return {
								h : 360 * a.h,
								s : a.s,
								l : a.l,
								a : m
							}
						},
						toHslString : function () {
							var a = e(h, j, l),
							b = w(360 * a.h),
							c = w(100 * a.s),
							d = w(100 * a.l);
							return 1 == m ? "hsl(" + b + ", " + c + "%, " + d + "%)" : "hsla(" + b + ", " + c + "%, " + d + "%, " + n + ")"
						},
						toHex : function (a) {
							return i(h, j, l, a)
						},
						toHexString : function (a) {
							return "#" + i(h, j, l, a)
						},
						toRgb : function () {
							return {
								r : w(h),
								g : w(j),
								b : w(l),
								a : m
							}
						},
						toRgbString : function () {
							return 1 == m ? "rgb(" + w(h) + ", " + w(j) + ", " + w(l) + ")" : "rgba(" + w(h) + ", " + w(j) + ", " + w(l) + ", " + n + ")"
						},
						toPercentageRgb : function () {
							return {
								r : w(100 * k(h, 255)) + "%",
								g : w(100 * k(j, 255)) + "%",
								b : w(100 * k(l, 255)) + "%",
								a : m
							}
						},
						toPercentageRgbString : function () {
							return 1 == m ? "rgb(" + w(100 * k(h, 255)) + "%, " + w(100 * k(j, 255)) + "%, " + w(100 * k(l, 255)) + "%)" : "rgba(" + w(100 * k(h, 255)) + "%, " + w(100 * k(j, 255)) + "%, " + w(100 * k(l, 255)) + "%, " + n + ")"
						},
						toName : function () {
							return B[i(h, j, l, !0)] || !1
						},
						toFilter : function (a) {
							var c = i(h, j, l),
							e = c,
							f = Math.round(255 * parseFloat(m)).toString(16),
							g = f,
							k = d && d.gradientType ? "GradientType = 1, " : "";
							if (a) {
								var n = b(a);
								e = n.toHex(),
								g = Math.round(255 * parseFloat(n.alpha)).toString(16)
							}
							return "progid:DXImageTransform.Microsoft.gradient(" + k + "startColorstr=#" + p(f) + c + ",endColorstr=#" + p(g) + e + ")"
						},
						toString : function (a) {
							a = a || this.format;
							var b = !1;
							return "rgb" === a && (b = this.toRgbString()),
							"prgb" === a && (b = this.toPercentageRgbString()),
							("hex" === a || "hex6" === a) && (b = this.toHexString()),
							"hex3" === a && (b = this.toHexString(!0)),
							"name" === a && (b = this.toName()),
							"hsl" === a && (b = this.toHslString()),
							"hsv" === a && (b = this.toHsvString()),
							b || this.toHexString()
						}
					}
				}
				function c(a) {
					var b = {
						r : 0,
						g : 0,
						b : 0
					},
					c = 1,
					e = !1,
					g = !1;
					return "string" == typeof a && (a = r(a)),
					"object" == typeof a && (a.hasOwnProperty("r") && a.hasOwnProperty("g") && a.hasOwnProperty("b") ? (b = d(a.r, a.g, a.b), e = !0, g = "%" === String(a.r).substr(-1) ? "prgb" : "rgb") : a.hasOwnProperty("h") && a.hasOwnProperty("s") && a.hasOwnProperty("v") ? (a.s = q(a.s), a.v = q(a.v), b = h(a.h, a.s, a.v), e = !0, g = "hsv") : a.hasOwnProperty("h") && a.hasOwnProperty("s") && a.hasOwnProperty("l") && (a.s = q(a.s), a.l = q(a.l), b = f(a.h, a.s, a.l), e = !0, g = "hsl"), a.hasOwnProperty("a") && (c = a.a)),
					c = parseFloat(c),
					(isNaN(c) || 0 > c || c > 1) && (c = 1), {
						ok : e,
						format : a.format || g,
						r : x(255, y(b.r, 0)),
						g : x(255, y(b.g, 0)),
						b : x(255, y(b.b, 0)),
						a : c
					}
				}
				function d(a, b, c) {
					return {
						r : 255 * k(a, 255),
						g : 255 * k(b, 255),
						b : 255 * k(c, 255)
					}
				}
				function e(a, b, c) {
					a = k(a, 255),
					b = k(b, 255),
					c = k(c, 255);
					var d,
					e,
					f = y(a, b, c),
					g = x(a, b, c),
					h = (f + g) / 2;
					if (f == g)
						d = e = 0;
					else {
						var i = f - g;
						switch (e = h > .5 ? i / (2 - f - g) : i / (f + g), f) {
						case a:
							d = (b - c) / i + (c > b ? 6 : 0);
							break;
						case b:
							d = (c - a) / i + 2;
							break;
						case c:
							d = (a - b) / i + 4
						}
						d /= 6
					}
					return {
						h : d,
						s : e,
						l : h
					}
				}
				function f(a, b, c) {
					function d(a, b, c) {
						return 0 > c && (c += 1),
						c > 1 && (c -= 1),
						1 / 6 > c ? a + 6 * (b - a) * c : .5 > c ? b : 2 / 3 > c ? a + 6 * (b - a) * (2 / 3 - c) : a
					}
					var e,
					f,
					g;
					if (a = k(a, 360), b = k(b, 100), c = k(c, 100), 0 === b)
						e = f = g = c;
					else {
						var h = .5 > c ? c * (1 + b) : c + b - c * b,
						i = 2 * c - h;
						e = d(i, h, a + 1 / 3),
						f = d(i, h, a),
						g = d(i, h, a - 1 / 3)
					}
					return {
						r : 255 * e,
						g : 255 * f,
						b : 255 * g
					}
				}
				function g(a, b, c) {
					a = k(a, 255),
					b = k(b, 255),
					c = k(c, 255);
					var d,
					e,
					f = y(a, b, c),
					g = x(a, b, c),
					h = f,
					i = f - g;
					if (e = 0 === f ? 0 : i / f, f == g)
						d = 0;
					else {
						switch (f) {
						case a:
							d = (b - c) / i + (c > b ? 6 : 0);
							break;
						case b:
							d = (c - a) / i + 2;
							break;
						case c:
							d = (a - b) / i + 4
						}
						d /= 6
					}
					return {
						h : d,
						s : e,
						v : h
					}
				}
				function h(a, b, c) {
					a = 6 * k(a, 360),
					b = k(b, 100),
					c = k(c, 100);
					var d = v.floor(a),
					e = a - d,
					f = c * (1 - b),
					g = c * (1 - e * b),
					h = c * (1 - (1 - e) * b),
					i = d % 6,
					j = [c, g, f, f, h, c][i],
					l = [h, c, c, g, f, f][i],
					m = [f, f, h, c, c, g][i];
					return {
						r : 255 * j,
						g : 255 * l,
						b : 255 * m
					}
				}
				function i(a, b, c, d) {
					var e = [p(w(a).toString(16)), p(w(b).toString(16)), p(w(c).toString(16))];
					return d && e[0].charAt(0) == e[0].charAt(1) && e[1].charAt(0) == e[1].charAt(1) && e[2].charAt(0) == e[2].charAt(1) ? e[0].charAt(0) + e[1].charAt(0) + e[2].charAt(0) : e.join("")
				}
				function j(a) {
					var b = {};
					for (var c in a)
						a.hasOwnProperty(c) && (b[a[c]] = c);
					return b
				}
				function k(a, b) {
					n(a) && (a = "100%");
					var c = o(a);
					return a = x(b, y(0, parseFloat(a))),
					c && (a = parseInt(a * b, 10) / 100),
					v.abs(a - b) < 1e-6 ? 1 : a % b / parseFloat(b)
				}
				function l(a) {
					return x(1, y(0, a))
				}
				function m(a) {
					return parseInt(a, 16)
				}
				function n(a) {
					return "string" == typeof a && -1 != a.indexOf(".") && 1 === parseFloat(a)
				}
				function o(a) {
					return "string" == typeof a && -1 != a.indexOf("%")
				}
				function p(a) {
					return 1 == a.length ? "0" + a : "" + a
				}
				function q(a) {
					return 1 >= a && (a = 100 * a + "%"),
					a
				}
				function r(a) {
					a = a.replace(s, "").replace(t, "").toLowerCase();
					var b = !1;
					if (A[a])
						a = A[a], b = !0;
					else if ("transparent" == a)
						return {
							r : 0,
							g : 0,
							b : 0,
							a : 0
						};
					var c;
					return (c = C.rgb.exec(a)) ? {
						r : c[1],
						g : c[2],
						b : c[3]
					}
					 : (c = C.rgba.exec(a)) ? {
						r : c[1],
						g : c[2],
						b : c[3],
						a : c[4]
					}
					 : (c = C.hsl.exec(a)) ? {
						h : c[1],
						s : c[2],
						l : c[3]
					}
					 : (c = C.hsla.exec(a)) ? {
						h : c[1],
						s : c[2],
						l : c[3],
						a : c[4]
					}
					 : (c = C.hsv.exec(a)) ? {
						h : c[1],
						s : c[2],
						v : c[3]
					}
					 : (c = C.hex6.exec(a)) ? {
						r : m(c[1]),
						g : m(c[2]),
						b : m(c[3]),
						format : b ? "name" : "hex"
					}
					 : (c = C.hex3.exec(a)) ? {
						r : m(c[1] + "" + c[1]),
						g : m(c[2] + "" + c[2]),
						b : m(c[3] + "" + c[3]),
						format : b ? "name" : "hex"
					}
					 : !1
				}
				var s = /^[\s,#]+/,
				t = /\s+$/,
				u = 0,
				v = Math,
				w = v.round,
				x = v.min,
				y = v.max,
				z = v.random;
				b.fromRatio = function (a, c) {
					if ("object" == typeof a) {
						var d = {};
						for (var e in a)
							a.hasOwnProperty(e) && (d[e] = "a" === e ? a[e] : q(a[e]));
						a = d
					}
					return b(a, c)
				},
				b.equals = function (a, c) {
					return a && c ? b(a).toRgbString() == b(c).toRgbString() : !1
				},
				b.random = function () {
					return b.fromRatio({
						r : z(),
						g : z(),
						b : z()
					})
				},
				b.desaturate = function (a, c) {
					var d = b(a).toHsl();
					return d.s -= (c || 10) / 100,
					d.s = l(d.s),
					b(d)
				},
				b.saturate = function (a, c) {
					var d = b(a).toHsl();
					return d.s += (c || 10) / 100,
					d.s = l(d.s),
					b(d)
				},
				b.greyscale = function (a) {
					return b.desaturate(a, 100)
				},
				b.lighten = function (a, c) {
					var d = b(a).toHsl();
					return d.l += (c || 10) / 100,
					d.l = l(d.l),
					b(d)
				},
				b.darken = function (a, c) {
					var d = b(a).toHsl();
					return d.l -= (c || 10) / 100,
					d.l = l(d.l),
					b(d)
				},
				b.complement = function (a) {
					var c = b(a).toHsl();
					return c.h = (c.h + 180) % 360,
					b(c)
				},
				b.triad = function (a) {
					var c = b(a).toHsl(),
					d = c.h;
					return [b(a), b({
							h : (d + 120) % 360,
							s : c.s,
							l : c.l
						}), b({
							h : (d + 240) % 360,
							s : c.s,
							l : c.l
						})]
				},
				b.tetrad = function (a) {
					var c = b(a).toHsl(),
					d = c.h;
					return [b(a), b({
							h : (d + 90) % 360,
							s : c.s,
							l : c.l
						}), b({
							h : (d + 180) % 360,
							s : c.s,
							l : c.l
						}), b({
							h : (d + 270) % 360,
							s : c.s,
							l : c.l
						})]
				},
				b.splitcomplement = function (a) {
					var c = b(a).toHsl(),
					d = c.h;
					return [b(a), b({
							h : (d + 72) % 360,
							s : c.s,
							l : c.l
						}), b({
							h : (d + 216) % 360,
							s : c.s,
							l : c.l
						})]
				},
				b.analogous = function (a, c, d) {
					c = c || 6,
					d = d || 30;
					var e = b(a).toHsl(),
					f = 360 / d,
					g = [b(a)];
					for (e.h = (e.h - (f * c >> 1) + 720) % 360; --c; )
						e.h = (e.h + f) % 360, g.push(b(e));
					return g
				},
				b.monochromatic = function (a, c) {
					c = c || 6;
					for (var d = b(a).toHsv(), e = d.h, f = d.s, g = d.v, h = [], i = 1 / c; c--; )
						h.push(b({
								h : e,
								s : f,
								v : g
							})), g = (g + i) % 1;
					return h
				},
				b.readability = function (a, c) {
					var d = b(a).toRgb(),
					e = b(c).toRgb(),
					f = (299 * d.r + 587 * d.g + 114 * d.b) / 1e3,
					g = (299 * e.r + 587 * e.g + 114 * e.b) / 1e3,
					h = Math.max(d.r, e.r) - Math.min(d.r, e.r) + Math.max(d.g, e.g) - Math.min(d.g, e.g) + Math.max(d.b, e.b) - Math.min(d.b, e.b);
					return {
						brightness : Math.abs(f - g),
						color : h
					}
				},
				b.readable = function (a, c) {
					var d = b.readability(a, c);
					return d.brightness > 125 && d.color > 500
				},
				b.mostReadable = function (a, c) {
					for (var d = null, e = 0, f = !1, g = 0; g < c.length; g++) {
						var h = b.readability(a, c[g]),
						i = h.brightness > 125 && h.color > 500,
						j = 3 * (h.brightness / 125) + h.color / 500;
						(i && !f || i && f && j > e || !i && !f && j > e) && (f = i, e = j, d = b(c[g]))
					}
					return d
				};
				var A = b.names = {
					aliceblue : "f0f8ff",
					antiquewhite : "faebd7",
					aqua : "0ff",
					aquamarine : "7fffd4",
					azure : "f0ffff",
					beige : "f5f5dc",
					bisque : "ffe4c4",
					black : "000",
					blanchedalmond : "ffebcd",
					blue : "00f",
					blueviolet : "8a2be2",
					brown : "a52a2a",
					burlywood : "deb887",
					burntsienna : "ea7e5d",
					cadetblue : "5f9ea0",
					chartreuse : "7fff00",
					chocolate : "d2691e",
					coral : "ff7f50",
					cornflowerblue : "6495ed",
					cornsilk : "fff8dc",
					crimson : "dc143c",
					cyan : "0ff",
					darkblue : "00008b",
					darkcyan : "008b8b",
					darkgoldenrod : "b8860b",
					darkgray : "a9a9a9",
					darkgreen : "006400",
					darkgrey : "a9a9a9",
					darkkhaki : "bdb76b",
					darkmagenta : "8b008b",
					darkolivegreen : "556b2f",
					darkorange : "ff8c00",
					darkorchid : "9932cc",
					darkred : "8b0000",
					darksalmon : "e9967a",
					darkseagreen : "8fbc8f",
					darkslateblue : "483d8b",
					darkslategray : "2f4f4f",
					darkslategrey : "2f4f4f",
					darkturquoise : "00ced1",
					darkviolet : "9400d3",
					deeppink : "ff1493",
					deepskyblue : "00bfff",
					dimgray : "696969",
					dimgrey : "696969",
					dodgerblue : "1e90ff",
					firebrick : "b22222",
					floralwhite : "fffaf0",
					forestgreen : "228b22",
					fuchsia : "f0f",
					gainsboro : "dcdcdc",
					ghostwhite : "f8f8ff",
					gold : "ffd700",
					goldenrod : "daa520",
					gray : "808080",
					green : "008000",
					greenyellow : "adff2f",
					grey : "808080",
					honeydew : "f0fff0",
					hotpink : "ff69b4",
					indianred : "cd5c5c",
					indigo : "4b0082",
					ivory : "fffff0",
					khaki : "f0e68c",
					lavender : "e6e6fa",
					lavenderblush : "fff0f5",
					lawngreen : "7cfc00",
					lemonchiffon : "fffacd",
					lightblue : "add8e6",
					lightcoral : "f08080",
					lightcyan : "e0ffff",
					lightgoldenrodyellow : "fafad2",
					lightgray : "d3d3d3",
					lightgreen : "90ee90",
					lightgrey : "d3d3d3",
					lightpink : "ffb6c1",
					lightsalmon : "ffa07a",
					lightseagreen : "20b2aa",
					lightskyblue : "87cefa",
					lightslategray : "789",
					lightslategrey : "789",
					lightsteelblue : "b0c4de",
					lightyellow : "ffffe0",
					lime : "0f0",
					limegreen : "32cd32",
					linen : "faf0e6",
					magenta : "f0f",
					maroon : "800000",
					mediumaquamarine : "66cdaa",
					mediumblue : "0000cd",
					mediumorchid : "ba55d3",
					mediumpurple : "9370db",
					mediumseagreen : "3cb371",
					mediumslateblue : "7b68ee",
					mediumspringgreen : "00fa9a",
					mediumturquoise : "48d1cc",
					mediumvioletred : "c71585",
					midnightblue : "191970",
					mintcream : "f5fffa",
					mistyrose : "ffe4e1",
					moccasin : "ffe4b5",
					navajowhite : "ffdead",
					navy : "000080",
					oldlace : "fdf5e6",
					olive : "808000",
					olivedrab : "6b8e23",
					orange : "ffa500",
					orangered : "ff4500",
					orchid : "da70d6",
					palegoldenrod : "eee8aa",
					palegreen : "98fb98",
					paleturquoise : "afeeee",
					palevioletred : "db7093",
					papayawhip : "ffefd5",
					peachpuff : "ffdab9",
					peru : "cd853f",
					pink : "ffc0cb",
					plum : "dda0dd",
					powderblue : "b0e0e6",
					purple : "800080",
					red : "f00",
					rosybrown : "bc8f8f",
					royalblue : "4169e1",
					saddlebrown : "8b4513",
					salmon : "fa8072",
					sandybrown : "f4a460",
					seagreen : "2e8b57",
					seashell : "fff5ee",
					sienna : "a0522d",
					silver : "c0c0c0",
					skyblue : "87ceeb",
					slateblue : "6a5acd",
					slategray : "708090",
					slategrey : "708090",
					snow : "fffafa",
					springgreen : "00ff7f",
					steelblue : "4682b4",
					tan : "d2b48c",
					teal : "008080",
					thistle : "d8bfd8",
					tomato : "ff6347",
					turquoise : "40e0d0",
					violet : "ee82ee",
					wheat : "f5deb3",
					white : "fff",
					whitesmoke : "f5f5f5",
					yellow : "ff0",
					yellowgreen : "9acd32"
				},
				B = b.hexNames = j(A),
				C = function () {
					var a = "[-\\+]?\\d+%?",
					b = "[-\\+]?\\d*\\.\\d+%?",
					c = "(?:" + b + ")|(?:" + a + ")",
					d = "[\\s|\\(]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")\\s*\\)?",
					e = "[\\s|\\(]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")\\s*\\)?";
					return {
						rgb : new RegExp("rgb" + d),
						rgba : new RegExp("rgba" + e),
						hsl : new RegExp("hsl" + d),
						hsla : new RegExp("hsla" + e),
						hsv : new RegExp("hsv" + d),
						hex3 : /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
						hex6 : /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
					}
				}
				();
				a.tinycolor = b
			}
			(this),
			b(function () {
				b.fn.spectrum.load && b.fn.spectrum.processNativeColorInputs()
			})
		}
			(window, jQuery), define("colorpicker", ["jquery"], function () {}), define("strut/config/config", [], function () {
				var a = {
					slide : {
						size : {
							width : 1024,
							height : 768
						},
						overviewSize : {
							width : 75,
							height : 50
						}
					}
				},
				b = localStorage.getItem("Strut_sessionMeta");
				try {
					var c = JSON.parse(b)
				} catch (d) {}

				var c = c || {
					generator_index : 0
				};
				return window.config = a,
				window.sessionMeta = c,
				a
			}), define("common/EventEmitter", [], function () {
				function a() {
					return this instanceof a ? (this._events = null, this._deferer = "undefined" != typeof process && "undefined" != typeof process.nextTick ? function (a, b, c) {
						process.nextTick(function () {
							a(b, c)
						})
					}
						 : function (a, b, c) {
						setTimeout(function () {
							a(b, c)
						}, 0)
					}, void 0) : new a
				}
				return a.prototype = {
					_listeners : function (a) {
						var b = this._events || (this._events = {});
						return b[a] || (b[a] = [])
					},
					_emit : function (a, b) {
						if (a instanceof Array && (a = JSON.stringify(a)), this._events) {
							var c = this._events[a];
							if (c)
								for (var d = c.length; d--; ) {
									var e = c[d];
									e && e.cb.apply(e.context, b)
								}
						}
					},
					_splice : function (a, b, c) {
						return a = Array.prototype.slice.call(a),
						a.splice(b, c)
					},
					_indexOfSub : function (a, b, c) {
						for (var d = 0; d < a.length; ++d)
							if (a[d].cb === b && a[d].context === c)
								return d;
						return -1
					},
					emit : function (a) {
						var b = arguments.length > 1 ? this._splice(arguments, 1, arguments.length) : [];
						this._emit(a, b)
					},
					trigger : function () {
						this.emit.apply(this, arguments)
					},
					emitDeferred : function (a) {
						var b = arguments.length > 1 ? this._splice(arguments, 1, arguments.length) : [];
						this._deferer(emit, a, b)
					},
					on : function (a, b, c) {
						if (!b)
							throw "Undefined callback provided";
						a instanceof Array && (a = JSON.stringify(a));
						var d = this._listeners(a),
						e = this._indexOfSub(d, b, c);
						0 > e && (d.push({
								cb : b,
								context : c
							}), e = d.length - 1);
						var f = this;
						return {
							dispose : function () {
								f.removeListener(a, b, c)
							}
						}
					},
					once : function (a, b, c) {
						var d = {
							sub : null
						};
						return d.sub = this.on(a, function () {
								d.sub.dispose(),
								b.apply(c, arguments)
							}),
						d.sub
					},
					removeListener : function (a, b, c) {
						var d = this._listeners(a),
						e = this._indexOfSub(d, b, c);
						e >= 0 && d.splice(e, 1),
						0 == d.length && delete this._events[a]
					},
					getNumListeners : function (a) {
						var b = 0;
						return this._events[a] && (b = this._events[a].length),
						b
					},
					off : function (a, b, c) {
						this.removeListener(a, b, c)
					},
					removeAllListeners : function () {
						this._events = null
					}
				},
				a
			}), define("common/collections/MultiMap", [], function () {
				"use strict";
				function a() {
					this._map = {}

				}
				return a.prototype = {
					put : function (a, b) {
						var c = this._map[a];
						return null == c && (c = [], this._map[a] = c),
						c.push(b),
						this
					},
					putAll : function (a, b) {
						var c = this._map[a];
						return null == c && (c = []),
						this._map[a] = c.concat(b),
						this
					},
					get : function (a) {
						var b = this._map[a];
						return b || []
					},
					remove : function (a, b) {
						var c = this._map[a],
						d = c.indexOf(b);
						return d >= 0 ? c.length <= 1 ? (this.removeAll(a), []) : (c.splice(d, 1), c) : void 0
					},
					removeAll : function (a) {
						return delete this._map[a],
						this
					},
					putIfAbsent : function (a, b) {
						var c = this._map[a];
						return null == c && (c = [], this._map[a] = c),
						c.indexOf(b) < 0 && c.push(b),
						this
					}
				},
				a
			}), define("framework/ServiceRegistry", ["common/EventEmitter", "common/collections/MultiMap"], function (a, b) {
				"use strict";
				function c() {
					this._services = new b
				}
				function d(a, b, c) {
					this._interfaces = a,
					this._meta = b || {},
					this._service = c
				}
				var e = 0,
				f = c.prototype = Object.create(a.prototype);
				f.register = function (a, b) {
					null == b.__registryIdentifier && (b.__registryIdentifier = ++e);
					var c;
					Array.isArray(a) ? (c = a, a = {}) : "string" == typeof a ? (c = [a], a = {}) : c = Array.isArray(a.interfaces) ? a.interfaces : [a.interfaces];
					var f = new d(c, a.meta, b);
					return c.forEach(function (a) {
						this._services.put(a, f),
						this.emit("registered:" + a, f)
					}, this),
					this.emit("registered", f),
					this
				},
				f.deregister = function (a) {
					return a = this.normalize(a),
					this._deregister(a),
					this
				},
				f._deregister = function (a) {
					var b = [];
					a.interfaces.forEach(function (c) {
						var d = this._services.get(c);
						d.forEach(function (d) {
							d._matches(a) && (this._services.remove(c, d), b.push(d))
						}, this)
					}, this),
					b.forEach(function (a) {
						this.emit("deregistered", a)
					}, this)
				},
				f.getBest = function (a) {
					var b = this.getBestEntry(a);
					return null != b ? b.service() : null
				},
				f.getBestEntry = function (a) {
					return this.get(a)[0]
				};
				var g = f.normalize = function (a) {
					var b = {};
					return "string" == typeof a ? b.interfaces = [a] : Array.isArray(a) ? b.interfaces = a : (b = a, Array.isArray(b.interfaces) || (b.interfaces = [b.interfaces])),
					b
				};
				return f.get = function (a) {
					var b,
					c = this.normalize(a),
					d = {};
					c.interfaces.some(function (c, e) {
						return b = {},
						this._services.get(c).forEach(function (c) {
							c.metaMatches(a.meta) && (0 == e || null != d[c.serviceIdentifier()]) && (b[c.serviceIdentifier()] = c)
						}),
						d = b,
						0 == Object.keys(b).length
					}, this);
					var e = [];
					for (var f in b)
						e.push(b[f]);
					return e
				},
				f.getInvoke = function (a, b, c) {
					var d = this.get(a),
					e = {};
					return d.forEach(function (a) {
						var d = a.service(),
						f = d[b].apply(d, c);
						e[f.id] = f
					}, this),
					e
				},
				d.prototype = {
					equals : function (a) {
						return a._service.__registryIdentifier == this._service.__registryIdentifier
					},
					service : function () {
						return this._service
					},
					meta : function () {
						return this._meta
					},
					matches : function (a) {
						a = g(a);
						var b = {};
						return a.interfaces.forEach(function (a) {
							b[a] = !0
						}),
						this._interfaces.every(function (a) {
							return b[a]
						})
					},
					metaMatches : function (a) {
						if (null == a)
							return !0;
						for (var b in a)
							if (!_.isEqual(a[b], this._meta[b]))
								return !1;
						return !0
					},
					serviceIdentifier : function () {
						return this._service.__registryIdentifier
					}
				},
				c
			}), function (a, b) {
			"use strict";
			function c(a) {
				return new d(a)
			}
			function d(a) {
				return a && a.__wrapped__ ? a : (this.__wrapped__ = a, void 0)
			}
			function e(a, b) {
				return function (c, d, e) {
					return a.call(b, c, d, e)
				}
			}
			function f(a, b, c) {
				b || (b = 0);
				var d = a.length,
				e = d - b >= (c || Gb),
				f = e ? {}

				 : a;
				if (e)
					for (var g, h = b - 1; ++h < d; )
						g = a[h] + "", (Wb.call(f, g) ? f[g] : f[g] = []).push(a[h]);
				return function (a) {
					if (e) {
						var c = a + "";
						return Wb.call(f, c) && L(f[c], a) > -1
					}
					return L(f, a, b) > -1
				}
			}
			function g(a, c) {
				var d = a.index,
				e = c.index;
				if (a = a.criteria, c = c.criteria, a !== c) {
					if (a > c || a === b)
						return 1;
					if (c > a || c === b)
						return -1
				}
				return e > d ? -1 : 1
			}
			function h(a, b, c) {
				function d() {
					var h = arguments,
					i = f ? this : b;
					if (e || (a = b[g]), c.length && (h = h.length ? c.concat(Zb.call(h)) : c), this instanceof d) {
						l.prototype = a.prototype,
						i = new l;
						var j = a.apply(i, h);
						return j && Gc[typeof j] ? j : i
					}
					return a.apply(i, h)
				}
				var e = o(a),
				f = !c,
				g = a;
				return f && (c = b),
				d
			}
			function i() {
				for (var a, b, c, d = -1, f = arguments.length, h = {
						bottom : "",
						exit : "",
						init : "",
						top : "",
						arrayBranch : {
							beforeLoop : ""
						},
						objectBranch : {
							beforeLoop : ""
						}
					}; ++d < f; ) {
					a = arguments[d];
					for (b in a)
						c = null == (c = a[b]) ? "" : c, /beforeLoop|inLoop/.test(b) ? ("string" == typeof c && (c = {
									array : c,
									object : c
								}), h.arrayBranch[b] = c.array || "", h.objectBranch[b] = c.object || "") : h[b] = c
				}
				var i = h.args,
				j = /^[^,]+/.exec(i)[0],
				k = h.useStrict;
				h.firstArg = j,
				h.hasDontEnumBug = Cb,
				h.isKeysFast = zc,
				h.noArgsEnum = sc,
				h.shadowed = Tb,
				h.useHas = h.useHas !== !1,
				h.useStrict = null == k ? Ac : k,
				null == h.noCharByIndex && (h.noCharByIndex = vc),
				h.exit || (h.exit = "if (!" + j + ") return result"),
				"collection" == j && h.arrayBranch.inLoop || (h.arrayBranch = null);
				var l = Function("arrayLikeClasses, ArrayProto, bind, bindIterator, compareAscending, concat, forIn, hasOwnProperty, identity, indexOf, isArguments, isArray, isFunction, isPlainObject, objectClass, objectTypes, nativeKeys, propertyIsEnumerable, slice, stringClass, toString", "var callee = function(" + i + ") {\n" + Ic(h) + "\n};\n" + "return callee");
				return l(Cc, Ab, ab, e, g, Vb, Xc, Wb, mb, L, n, Sc, o, Tc, nc, Gc, dc, Yb, Zb, pc, $b)
			}
			function j(a) {
				return "\\" + Hc[a]
			}
			function k(a) {
				return Ec[a]
			}
			function l() {}

			function m(a) {
				return Fc[a]
			}
			function n(a) {
				return $b.call(a) == hc
			}
			function o(a) {
				return "function" == typeof a
			}
			function p(a, b) {
				var c = !1;
				if (!a || "object" != typeof a || !b && n(a))
					return c;
				var d = a.constructor;
				return wc && "function" != typeof a.toString && "string" == typeof(a + "") || o(d) && !(d instanceof d) ? c : Eb ? (Xc(a, function (a, b, d) {
						return c = !Wb.call(d, b),
						!1
					}), c === !1) : (Xc(a, function (a, b) {
						c = b
					}), c === !1 || Wb.call(a, c))
			}
			function q(a, b, c, d, e) {
				if (null == a)
					return a;
				c && (b = !1);
				var f = Gc[typeof a];
				if (f) {
					var g = $b.call(a);
					if (!Dc[g] || tc && n(a))
						return a;
					var h = g == ic;
					f = h || (g == nc ? Tc(a, !0) : f)
				}
				if (!f || !b)
					return f ? h ? Zb.call(a) : Wc({}, a) : a;
				var i = a.constructor;
				switch (g) {
				case jc:
					return new i(1 == a);
				case kc:
					return new i(+a);
				case mc:
				case pc:
					return new i(a);
				case oc:
					return i(a.source, Nb.exec(a))
				}
				d || (d = []),
				e || (e = []);
				for (var j = d.length; j--; )
					if (d[j] == a)
						return e[j];
				var k = h ? i(j = a.length) : {};
				if (d.push(a), e.push(k), h)
					for (var l = -1; ++l < j; )
						k[l] = q(a[l], b, null, d, e);
				else
					Yc(a, function (a, c) {
						k[c] = q(a, b, null, d, e)
					});
				return k
			}
			function r(a, b) {
				return a ? Wb.call(a, b) : !1
			}
			function s(a) {
				return a === !0 || a === !1 || $b.call(a) == jc
			}
			function t(a) {
				return $b.call(a) == kc
			}
			function u(a) {
				return a ? 1 === a.nodeType : !1
			}
			function v(a, b, c, d) {
				if (null == a || null == b)
					return a === b;
				if (a === b)
					return 0 !== a || 1 / a == 1 / b;
				(Gc[typeof a] || Gc[typeof b]) && (a = a.__wrapped__ || a, b = b.__wrapped__ || b);
				var e = $b.call(a);
				if (e != $b.call(b))
					return !1;
				switch (e) {
				case jc:
				case kc:
					return +a == +b;
				case mc:
					return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
				case oc:
				case pc:
					return a == b + ""
				}
				var f = Cc[e];
				if (tc && !f && (f = n(a)) && !n(b))
					return !1;
				if (!f && (e != nc || wc && ("function" != typeof a.toString && "string" == typeof(a + "") || "function" != typeof b.toString && "string" == typeof(b + ""))))
					return !1;
				c || (c = []),
				d || (d = []);
				for (var g = c.length; g--; )
					if (c[g] == a)
						return d[g] == b;
				var h = -1,
				i = !0,
				j = 0;
				if (c.push(a), d.push(b), f) {
					if (j = a.length, i = j == b.length)
						for (; j-- && (i = v(a[j], b[j], c, d)); );
					return i
				}
				var k = a.constructor,
				l = b.constructor;
				if (k != l && !(o(k) && k instanceof k && o(l) && l instanceof l))
					return !1;
				for (var m in a)
					if (Wb.call(a, m) && (j++, !Wb.call(b, m) || !v(a[m], b[m], c, d)))
						return !1;
				for (m in b)
					if (Wb.call(b, m) && !j--)
						return !1;
				if (Cb)
					for (; ++h < 7; )
						if (m = Tb[h], Wb.call(a, m) && (!Wb.call(b, m) || !v(a[m], b[m], c, d)))
							return !1;
				return !0
			}
			function w(a) {
				return cc(a) && $b.call(a) == mc
			}
			function x(a) {
				return a ? Gc[typeof a] : !1
			}
			function y(a) {
				return $b.call(a) == mc && a != +a
			}
			function z(a) {
				return null === a
			}
			function A(a) {
				return $b.call(a) == mc
			}
			function B(a) {
				return $b.call(a) == oc
			}
			function C(a) {
				return $b.call(a) == pc
			}
			function D(a) {
				return a === b
			}
			function E(a, b, c, d) {
				if (!a)
					return c;
				var f = a.length,
				g = arguments.length < 3;
				if (d && (b = e(b, d)), f === +f) {
					var h = vc && $b.call(a) == pc ? a.split("") : a;
					for (f && g && (c = h[--f]); f--; )
						c = b(c, h[f], f, a);
					return c
				}
				var i,
				j = ad(a);
				for (f = j.length, f && g && (c = a[j[--f]]); f--; )
					i = j[f], c = b(c, a[i], i, a);
				return c
			}
			function F(a) {
				if (!a)
					return 0;
				var b = a.length;
				return b === +b ? b : ad(a).length
			}
			function G(a) {
				if (!a)
					return [];
				var b = a.length;
				return b === +b ? (uc ? $b.call(a) == pc : "string" == typeof a) ? a.split("") : Zb.call(a) : fd(a)
			}
			function H(a) {
				var b = [];
				if (!a)
					return b;
				for (var c = -1, d = a.length; ++c < d; )
					a[c] && b.push(a[c]);
				return b
			}
			function I(a) {
				var b = [];
				if (!a)
					return b;
				for (var c = -1, d = a.length, e = Vb.apply(b, arguments), g = f(e, d); ++c < d; )
					g(a[c]) || b.push(a[c]);
				return b
			}
			function J(a, b, c) {
				return a ? null == b || c ? a[0] : Zb.call(a, 0, b) : void 0
			}
			function K(a, b) {
				var c = [];
				if (!a)
					return c;
				for (var d, e = -1, f = a.length; ++e < f; )
					d = a[e], Sc(d) ? Xb.apply(c, b ? d : K(d)) : c.push(d);
				return c
			}
			function L(a, b, c) {
				if (!a)
					return -1;
				var d = -1,
				e = a.length;
				if (c) {
					if ("number" != typeof c)
						return d = W(a, b), a[d] === b ? d : -1;
					d = (0 > c ? ec(0, e + c) : c) - 1
				}
				for (; ++d < e; )
					if (a[d] === b)
						return d;
				return -1
			}
			function M(a, b, c) {
				return a ? Zb.call(a, 0,  - (null == b || c ? 1 : b)) : []
			}
			function N(a) {
				var b = [];
				if (!a)
					return b;
				var c,
				d = arguments.length,
				e = [],
				g = -1,
				h = a.length;
				a : for (; ++g < h; )
					if (c = a[g], L(b, c) < 0) {
						for (var i = 1; d > i; i++)
							if (!(e[i] || (e[i] = f(arguments[i])))(c))
								continue a;
						b.push(c)
					}
				return b
			}
			function O(a, b, c) {
				if (a) {
					var d = a.length;
					return null == b || c ? a[d - 1] : Zb.call(a, -b || d)
				}
			}
			function P(a, b, c) {
				if (!a)
					return -1;
				var d = a.length;
				for (c && "number" == typeof c && (d = (0 > c ? ec(0, d + c) : fc(c, d - 1)) + 1); d--; )
					if (a[d] === b)
						return d;
				return -1
			}
			function Q(a, b, c) {
				var d = -1 / 0,
				f = d;
				if (!a)
					return f;
				var g,
				h = -1,
				i = a.length;
				if (!b) {
					for (; ++h < i; )
						a[h] > f && (f = a[h]);
					return f
				}
				for (c && (b = e(b, c)); ++h < i; )
					g = b(a[h], h, a), g > d && (d = g, f = a[h]);
				return f
			}
			function R(a, b, c) {
				var d = 1 / 0,
				f = d;
				if (!a)
					return f;
				var g,
				h = -1,
				i = a.length;
				if (!b) {
					for (; ++h < i; )
						a[h] < f && (f = a[h]);
					return f
				}
				for (c && (b = e(b, c)); ++h < i; )
					g = b(a[h], h, a), d > g && (d = g, f = a[h]);
				return f
			}
			function S(a, b) {
				if (!a)
					return {};
				for (var c = -1, d = a.length, e = {}; ++c < d; )
					b ? e[a[c]] = b[c] : e[a[c][0]] = a[c][1];
				return e
			}
			function T(a, b, c) {
				a = +a || 0,
				c = +c || 1,
				null == b && (b = a, a = 0);
				for (var d = -1, e = ec(0, Math.ceil((b - a) / c)), f = Array(e); ++d < e; )
					f[d] = a, a += c;
				return f
			}
			function U(a, b, c) {
				return a ? Zb.call(a, null == b || c ? 1 : b) : []
			}
			function V(a) {
				if (!a)
					return [];
				for (var b, c = -1, d = a.length, e = Array(d); ++c < d; )
					b = ac(gc() * (c + 1)), e[c] = e[b], e[b] = a[c];
				return e
			}
			function W(a, b, c, d) {
				if (!a)
					return 0;
				var e,
				f = 0,
				g = a.length;
				if (c)
					for (d && (c = ab(c, d)), b = c(b); g > f; )
						e = f + g >>> 1, c(a[e]) < b ? f = e + 1 : g = e;
				else
					for (; g > f; )
						e = f + g >>> 1, a[e] < b ? f = e + 1 : g = e;
				return f
			}
			function X() {
				for (var a = -1, b = [], c = Vb.apply(b, arguments), d = c.length; ++a < d; )
					L(b, c[a]) < 0 && b.push(c[a]);
				return b
			}
			function Y(a, b, c, d) {
				var f = [];
				if (!a)
					return f;
				var g,
				h = -1,
				i = a.length,
				j = [];
				for ("function" == typeof b && (d = c, c = b, b = !1), c ? d && (c = e(c, d)) : c = mb; ++h < i; )
					g = c(a[h], h, a), (b ? !h || j[j.length - 1] !== g : L(j, g) < 0) && (j.push(g), f.push(a[h]));
				return f
			}
			function Z(a) {
				var b = [];
				if (!a)
					return b;
				for (var c = -1, d = a.length, e = f(arguments, 1, 20); ++c < d; )
					e(a[c]) || b.push(a[c]);
				return b
			}
			function $(a) {
				if (!a)
					return [];
				for (var b = -1, c = Q(pd(arguments, "length")), d = Array(c); ++b < c; )
					d[b] = pd(arguments, b);
				return d
			}
			function _(a, b) {
				return 1 > a ? b() : function () {
					return --a < 1 ? b.apply(this, arguments) : void 0
				}
			}
			function ab(a, b) {
				return yc || _b && arguments.length > 2 ? _b.call.apply(_b, arguments) : h(a, b, Zb.call(arguments, 2))
			}
			function bb() {
				var a = arguments;
				return function () {
					for (var b = arguments, c = a.length; c--; )
						b = [a[c].apply(this, b)];
					return b[0]
				}
			}
			function cb(a, b, c) {
				function d() {
					h = null,
					c || (f = a.apply(g, e))
				}
				var e,
				f,
				g,
				h;
				return function () {
					var i = c && !h;
					return e = arguments,
					g = this,
					qc(h),
					h = rc(d, b),
					i && (f = a.apply(g, e)),
					f
				}
			}
			function db(a, c) {
				var d = Zb.call(arguments, 2);
				return rc(function () {
					return a.apply(b, d)
				}, c)
			}
			function eb(a) {
				var c = Zb.call(arguments, 1);
				return rc(function () {
					return a.apply(b, c)
				}, 1)
			}
			function fb(a, b) {
				return h(b, a, Zb.call(arguments, 2))
			}
			function gb(a, b) {
				var c = {};
				return function () {
					var d = b ? b.apply(this, arguments) : arguments[0];
					return Wb.call(c, d) ? c[d] : c[d] = a.apply(this, arguments)
				}
			}
			function hb(a) {
				var b,
				c = !1;
				return function () {
					return c ? b : (c = !0, b = a.apply(this, arguments), a = null, b)
				}
			}
			function ib(a) {
				return h(a, Zb.call(arguments, 1))
			}
			function jb(a, b) {
				function c() {
					h = new Date,
					g = null,
					e = a.apply(f, d)
				}
				var d,
				e,
				f,
				g,
				h = 0;
				return function () {
					var i = new Date,
					j = b - (i - h);
					return d = arguments,
					f = this,
					0 >= j ? (h = i, e = a.apply(f, d)) : g || (g = rc(c, j)),
					e
				}
			}
			function kb(a, b) {
				return function () {
					var c = [a];
					return arguments.length && Xb.apply(c, arguments),
					b.apply(this, c)
				}
			}
			function lb(a) {
				return null == a ? "" : (a + "").replace(Rb, k)
			}
			function mb(a) {
				return a
			}
			function nb(a) {
				ld(Zc(a), function (b) {
					var e = c[b] = a[b];
					d.prototype[b] = function () {
						var a = [this.__wrapped__];
						arguments.length && Xb.apply(a, arguments);
						var b = e.apply(c, a);
						return this.__chain__ && (b = new d(b), b.__chain__ = !0),
						b
					}
				})
			}
			function ob() {
				return a._ = Hb,
				this
			}
			function pb(a, b) {
				return null == a && null == b && (b = 1),
				a = +a || 0,
				null == b && (b = a, a = 0),
				a + ac(gc() * ((+b || 0) - a + 1))
			}
			function qb(a, b) {
				if (!a)
					return null;
				var c = a[b];
				return o(c) ? a[b]() : c
			}
			function rb(a, b, d) {
				d || (d = {}),
				a += "";
				var e,
				f,
				g = 0,
				h = c.templateSettings,
				i = "__p += '",
				k = d.variable || h.variable,
				l = k,
				m = RegExp((d.escape || h.escape || Qb).source + "|" + (d.interpolate || h.interpolate || Qb).source + "|" + (d.evaluate || h.evaluate || Qb).source + "|$", "g");
				if (a.replace(m, function (b, c, d, f, h) {
						i += a.slice(g, h).replace(Sb, j),
						i += c ? "' +\n__e(" + c + ") +\n'" : f ? "';\n" + f + ";\n__p += '" : d ? "' +\n((__t = (" + d + ")) == null ? '' : __t) +\n'" : "",
						e || (e = f || Ib.test(c || d)),
						g = h + b.length
					}), i += "';\n", !l)
					if (k = "obj", e)
						i = "with (" + k + ") {\n" + i + "\n}\n";
					else {
						var n = RegExp("(\\(\\s*)" + k + "\\." + k + "\\b", "g");
						i = i.replace(Ob, "$&" + k + ".").replace(n, "$1__d")
					}
				i = (e ? i.replace(Kb, "") : i).replace(Lb, "$1").replace(Mb, "$1;"),
				i = "function(" + k + ") {\n" + (l ? "" : k + " || (" + k + " = {});\n") + "var __t, __p = '', __e = _.escape" + (e ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : (l ? "" : ", __d = " + k + "." + k + " || " + k) + ";\n") + i + "return __p\n}";
				var o = Bc ? "\n//@ sourceURL=/lodash/template/source[" + Ub++ + "]" : "";
				try {
					f = Function("_", "return " + i + o)(c)
				} catch (p) {
					throw p.source = i,
					p
				}
				return b ? f(b) : (f.source = i, f)
			}
			function sb(a, b, c) {
				var d = -1,
				e = Array(a || 0);
				if (c)
					for (; ++d < a; )
						e[d] = b.call(c, d);
				else
					for (; ++d < a; )
						e[d] = b(d);
				return e
			}
			function tb(a) {
				return null == a ? "" : (a + "").replace(Jb, m)
			}
			function ub(a) {
				var b = Fb++;
				return a ? a + b : b
			}
			function vb(a) {
				return a = new d(a),
				a.__chain__ = !0,
				a
			}
			function wb(a, b) {
				return b(a),
				a
			}
			function xb() {
				return this.__chain__ = !0,
				this
			}
			function yb() {
				return this.__wrapped__
			}
			console.log("LOADING LODASH!!!!");
			var zb = "object" == typeof exports && exports && ("object" == typeof global && global && global == global.global && (a = global), exports),
			Ab = Array.prototype,
			Bb = (Boolean.prototype, Object.prototype);
			Number.prototype,
			String.prototype;
			var Cb,
			Db,
			Eb,
			Fb = 0,
			Gb = 30,
			Hb = a._,
			Ib = /[-?+=!~*%&^<>|{(\/]|\[\D|\b(?:delete|in|instanceof|new|typeof|void)\b/,
			Jb = /&(?:amp|lt|gt|quot|#x27);/g,
			Kb = /\b__p \+= '';/g,
			Lb = /\b(__p \+=) '' \+/g,
			Mb = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
			Nb = /\w*$/,
			Ob = /(?:__e|__t = )\(\s*(?![\d\s"']|this\.)/g,
			Pb = RegExp("^" + (Bb.valueOf + "").replace(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&").replace(/valueOf|for [^\]]+/g, ".+?") + "$"),
			Qb = /($^)/,
			Rb = /[&<>"']/g,
			Sb = /['\n\r\t\u2028\u2029\\]/g,
			Tb = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
			Ub = 0,
			Vb = Ab.concat,
			Wb = Bb.hasOwnProperty,
			Xb = Ab.push,
			Yb = Bb.propertyIsEnumerable,
			Zb = Ab.slice,
			$b = Bb.toString,
			_b = Pb.test(_b = Zb.bind) && _b,
			ac = Math.floor,
			bc = Pb.test(bc = Array.isArray) && bc,
			cc = a.isFinite,
			dc = Pb.test(dc = Object.keys) && dc,
			ec = Math.max,
			fc = Math.min,
			gc = Math.random,
			hc = "[object Arguments]",
			ic = "[object Array]",
			jc = "[object Boolean]",
			kc = "[object Date]",
			lc = "[object Function]",
			mc = "[object Number]",
			nc = "[object Object]",
			oc = "[object RegExp]",
			pc = "[object String]",
			qc = a.clearTimeout,
			rc = a.setTimeout,
			sc = !0;
			!function () {
				function a() {
					this.x = 1
				}
				var b = {
					0 : 1,
					length : 1
				},
				c = [];
				a.prototype = {
					valueOf : 1,
					y : 1
				};
				for (var d in new a)
					c.push(d);
				for (d in arguments)
					sc = !d;
				Cb = (c + "").length < 4,
				Eb = "x" != c[0],
				c.splice.call(b, 0, 1),
				Db = b[0]
			}
			(1);
			var tc = !n(arguments),
			uc = "x" != Zb.call("x")[0],
			vc = "xx" != "x"[0] + Object("x")[0];
			try {
				var wc = $b.call(a.document || 0) == nc
			} catch (xc) {}

			var yc = _b && /\n|Opera/.test(_b + $b.call(a.opera)),
			zc = dc && /^.+$|true/.test(dc + !!a.attachEvent),
			Ac = !yc;
			try {
				var Bc = (Function("//@")(), !a.attachEvent)
			} catch (xc) {}

			var Cc = {};
			Cc[jc] = Cc[kc] = Cc[lc] = Cc[mc] = Cc[nc] = Cc[oc] = !1,
			Cc[hc] = Cc[ic] = Cc[pc] = !0;
			var Dc = {};
			Dc[hc] = Dc[lc] = !1,
			Dc[ic] = Dc[jc] = Dc[kc] = Dc[mc] = Dc[nc] = Dc[oc] = Dc[pc] = !0;
			var Ec = {
				"&" : "&amp;",
				"<" : "&lt;",
				">" : "&gt;",
				'"' : "&quot;",
				"'" : "&#x27;"
			},
			Fc = {
				"&amp;" : "&",
				"&lt;" : "<",
				"&gt;" : ">",
				"&quot;" : '"',
				"&#x27;" : "'"
			},
			Gc = {
				"boolean" : !1,
				"function" : !0,
				object : !0,
				number : !1,
				string : !1,
				undefined : !1,
				unknown : !0
			},
			Hc = {
				"\\" : "\\",
				"'" : "'",
				"\n" : "n",
				"\r" : "r",
				"	" : "t",
				"\u2028" : "u2028",
				"\u2029" : "u2029"
			};
			c.templateSettings = {
				escape : /<%-([\s\S]+?)%>/g,
				evaluate : /<%([\s\S]+?)%>/g,
				interpolate : /<%=([\s\S]+?)%>/g,
				variable : ""
			};
			var Ic = rb("<% if (useStrict) { %>'use strict';\n<% } %>var index, value, iteratee = <%= firstArg %>, result<% if (init) { %> = <%= init %><% } %>;\n<%= exit %>;\n<%= top %>;\n<% if (arrayBranch) { %>var length = iteratee.length; index = -1;  <% if (objectBranch) { %>\nif (length === +length) {<% } %>  <% if (noCharByIndex) { %>\n  if (toString.call(iteratee) == stringClass) {\n    iteratee = iteratee.split('')\n  }  <% } %>\n  <%= arrayBranch.beforeLoop %>;\n  while (++index < length) {\n    value = iteratee[index];\n    <%= arrayBranch.inLoop %>\n  }  <% if (objectBranch) { %>\n}<% } %><% } %><% if (objectBranch) { %>  <% if (arrayBranch) { %>\nelse {  <%  } else if (noArgsEnum) { %>\n  var length = iteratee.length; index = -1;\n  if (length && isArguments(iteratee)) {\n    while (++index < length) {\n      value = iteratee[index += ''];\n      <%= objectBranch.inLoop %>\n    }\n  } else {  <% } %>  <% if (!hasDontEnumBug) { %>\n  var skipProto = typeof iteratee == 'function' && \n    propertyIsEnumerable.call(iteratee, 'prototype');\n  <% } %>  <% if (isKeysFast && useHas) { %>\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iteratee] ? nativeKeys(iteratee) : [],\n      length = ownProps.length;\n\n  <%= objectBranch.beforeLoop %>;\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n    <% if (!hasDontEnumBug) { %>if (!(skipProto && index == 'prototype')) {\n  <% } %>    value = iteratee[index];\n    <%= objectBranch.inLoop %>\n    <% if (!hasDontEnumBug) { %>}\n<% } %>  }  <% } else { %>\n  <%= objectBranch.beforeLoop %>;\n  for (index in iteratee) {<%    if (!hasDontEnumBug || useHas) { %>\n    if (<%      if (!hasDontEnumBug) { %>!(skipProto && index == 'prototype')<% }      if (!hasDontEnumBug && useHas) { %> && <% }      if (useHas) { %>hasOwnProperty.call(iteratee, index)<% }    %>) {    <% } %>\n    value = iteratee[index];\n    <%= objectBranch.inLoop %>;    <% if (!hasDontEnumBug || useHas) { %>\n    }<% } %>\n  }  <% } %>  <% if (hasDontEnumBug) { %>\n\n  var ctor = iteratee.constructor;\n    <% for (var k = 0; k < 7; k++) { %>\n  index = '<%= shadowed[k] %>';\n  if (<%      if (shadowed[k] == 'constructor') {        %>!(ctor && ctor.prototype === iteratee) && <%      } %>hasOwnProperty.call(iteratee, index)) {\n    value = iteratee[index];\n    <%= objectBranch.inLoop %>\n  }    <% } %>  <% } %>  <% if (arrayBranch || noArgsEnum) { %>\n}<% } %><% } %>\n<%= bottom %>;\nreturn result"),
			Jc = {
				args : "collection, callback, thisArg",
				init : "collection",
				top : "if (!callback) {\n  callback = identity\n}\nelse if (thisArg) {\n  callback = bindIterator(callback, thisArg)\n}",
				inLoop : "if (callback(value, index, collection) === false) return result"
			},
			Kc = {
				init : "{}",
				top : "var prop;\nif (typeof callback != 'function') {\n  var valueProp = callback;\n  callback = function(value) { return value[valueProp] }\n}\nelse if (thisArg) {\n  callback = bindIterator(callback, thisArg)\n}",
				inLoop : "prop = callback(value, index, collection);\n(hasOwnProperty.call(result, prop) ? result[prop]++ : result[prop] = 1)"
			},
			Lc = {
				init : "true",
				inLoop : "if (!callback(value, index, collection)) return !result"
			},
			Mc = {
				useHas : !1,
				useStrict : !1,
				args : "object",
				init : "object",
				top : "for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {\n  if (iteratee = arguments[argsIndex]) {",
				inLoop : "result[index] = value",
				bottom : "  }\n}"
			},
			Nc = {
				init : "[]",
				inLoop : "callback(value, index, collection) && result.push(value)"
			},
			Oc = {
				top : "if (thisArg) callback = bindIterator(callback, thisArg)"
			},
			Pc = {
				inLoop : {
					object : Jc.inLoop
				}
			},
			Qc = {
				init : "",
				exit : "if (!collection) return []",
				beforeLoop : {
					array : "result = Array(length)",
					object : "result = " + (zc ? "Array(length)" : "[]")
				},
				inLoop : {
					array : "result[index] = callback(value, index, collection)",
					object : "result" + (zc ? "[ownIndex] = " : ".push") + "(callback(value, index, collection))"
				}
			},
			Rc = {
				useHas : !1,
				args : "object, callback, thisArg",
				init : "{}",
				top : "var isFunc = typeof callback == 'function';\nif (!isFunc) {\n  var props = concat.apply(ArrayProto, arguments)\n} else if (thisArg) {\n  callback = bindIterator(callback, thisArg)\n}",
				inLoop : "if (isFunc\n  ? !callback(value, index, object)\n  : indexOf(props, index) < 0\n) result[index] = value"
			};
			tc && (n = function (a) {
				return !(!a || !Wb.call(a, "callee"))
			});
			var Sc = bc || function (a) {
				return $b.call(a) == ic
			};
			o(/x/) && (o = function (a) {
				return $b.call(a) == lc
			});
			var Tc = Gc.__proto__ != Bb ? p : function (a, b) {
				if (!a)
					return !1;
				var c = a.valueOf,
				d = "function" == typeof c && (d = c.__proto__) && d.__proto__;
				return d ? a == d || a.__proto__ == d && (b || !n(a)) : p(a)
			},
			Uc = i({
					args : "object",
					init : "[]",
					inLoop : "result.push(index)"
				}),
			Vc = i(Mc, {
					inLoop : "if (result[index] == null) " + Mc.inLoop
				}),
			Wc = i(Mc),
			Xc = i(Jc, Oc, Pc, {
					useHas : !1
				}),
			Yc = i(Jc, Oc, Pc),
			Zc = i({
					useHas : !1,
					args : "object",
					init : "[]",
					inLoop : "if (isFunction(value)) result.push(index)",
					bottom : "result.sort()"
				}),
			$c = i({
					args : "object",
					init : "{}",
					inLoop : "result[value] = index"
				}),
			_c = i({
					args : "value",
					init : "true",
					top : "var className = toString.call(value),\n    length = value.length;\nif (arrayLikeClasses[className]" + (tc ? " || isArguments(value)" : "") + " ||\n" + "  (className == objectClass && length === +length &&\n" + "  isFunction(value.splice))" + ") return !length",
					inLoop : {
						object : "return false"
					}
				}),
			ad = dc ? function (a) {
				var b = typeof a;
				return "function" == b && Yb.call(a, "prototype") ? Uc(a) : a && Gc[b] ? dc(a) : []
			}
			 : Uc,
			bd = i(Mc, {
					args : "object, source, indicator",
					top : "var argsLength, isArr, stackA, stackB,\n    args = arguments, argsIndex = 0;\nif (indicator == isPlainObject) {\n  argsLength = 2;\n  stackA = args[3];\n  stackB = args[4]\n} else {\n  argsLength = args.length;\n  stackA = [];\n  stackB = []\n}\nwhile (++argsIndex < argsLength) {\n  if (iteratee = args[argsIndex]) {",
					inLoop : "if ((source = value) && ((isArr = isArray(source)) || isPlainObject(source))) {\n  var found = false, stackLength = stackA.length;\n  while (stackLength--) {\n    if (found = stackA[stackLength] == source) break\n  }\n  if (found) {\n    result[index] = stackB[stackLength]\n  } else {\n    stackA.push(source);\n    stackB.push(value = (value = result[index]) && isArr\n      ? (isArray(value) ? value : [])\n      : (isPlainObject(value) ? value : {})\n    );\n    result[index] = callee(value, source, isPlainObject, stackA, stackB)\n  }\n} else if (source != null) {\n  result[index] = source\n}"
				}),
			cd = i(Rc),
			dd = i({
					args : "object",
					init : "[]",
					inLoop : "result" + (zc ? "[ownIndex] = " : ".push") + "([index, value])"
				}),
			ed = i(Rc, {
					top : "if (typeof callback != 'function') {\n  var prop,\n      props = concat.apply(ArrayProto, arguments),\n      length = props.length;\n  for (index = 1; index < length; index++) {\n    prop = props[index];\n    if (prop in object) result[prop] = object[prop]\n  }\n} else {\n  if (thisArg) callback = bindIterator(callback, thisArg)",
					inLoop : "if (callback(value, index, object)) result[index] = value",
					bottom : "}"
				}),
			fd = i({
					args : "object",
					init : "[]",
					inLoop : "result.push(value)"
				}),
			gd = i({
					args : "collection, target",
					init : "false",
					noCharByIndex : !1,
					beforeLoop : {
						array : "if (toString.call(collection) == stringClass) return collection.indexOf(target) > -1"
					},
					inLoop : "if (value === target) return true"
				}),
			hd = i(Jc, Kc),
			id = i(Jc, Lc),
			jd = i(Jc, Nc),
			kd = i(Jc, Oc, {
					init : "",
					inLoop : "if (callback(value, index, collection)) return value"
				}),
			ld = i(Jc, Oc),
			md = i(Jc, Kc, {
					inLoop : "prop = callback(value, index, collection);\n(hasOwnProperty.call(result, prop) ? result[prop] : result[prop] = []).push(value)"
				}),
			nd = i(Qc, {
					args : "collection, methodName",
					top : "var args = slice.call(arguments, 2),\n    isFunc = typeof methodName == 'function'",
					inLoop : {
						array : "result[index] = (isFunc ? methodName : value[methodName]).apply(value, args)",
						object : "result" + (zc ? "[ownIndex] = " : ".push") + "((isFunc ? methodName : value[methodName]).apply(value, args))"
					}
				}),
			od = i(Jc, Qc),
			pd = i(Qc, {
					args : "collection, property",
					inLoop : {
						array : "result[index] = value[property]",
						object : "result" + (zc ? "[ownIndex] = " : ".push") + "(value[property])"
					}
				}),
			qd = i({
					args : "collection, callback, accumulator, thisArg",
					init : "accumulator",
					top : "var noaccum = arguments.length < 3;\nif (thisArg) callback = bindIterator(callback, thisArg)",
					beforeLoop : {
						array : "if (noaccum) result = iteratee[++index]"
					},
					inLoop : {
						array : "result = callback(result, value, index, collection)",
						object : "result = noaccum\n  ? (noaccum = false, value)\n  : callback(result, value, index, collection)"
					}
				}),
			rd = i(Jc, Nc, {
					inLoop : "!" + Nc.inLoop
				}),
			sd = i(Jc, Lc, {
					init : "false",
					inLoop : Lc.inLoop.replace("!", "")
				}),
			td = i(Jc, Kc, Qc, {
					inLoop : {
						array : "result[index] = {\n  criteria: callback(value, index, collection),\n  index: index,\n  value: value\n}",
						object : "result" + (zc ? "[ownIndex] = " : ".push") + "({\n" + "  criteria: callback(value, index, collection),\n" + "  index: index,\n" + "  value: value\n" + "})"
					},
					bottom : "result.sort(compareAscending);\nlength = result.length;\nwhile (length--) {\n  result[length] = result[length].value\n}"
				}),
			ud = i(Nc, {
					args : "collection, properties",
					top : "var props = [];\nforIn(properties, function(value, prop) { props.push(prop) });\nvar propsLength = props.length",
					inLoop : "for (var prop, pass = true, propIndex = 0; propIndex < propsLength; propIndex++) {\n  prop = props[propIndex];\n  if (!(pass = value[prop] === properties[prop])) break\n}\npass && result.push(value)"
				}),
			vd = i({
					useHas : !1,
					useStrict : !1,
					args : "object",
					init : "object",
					top : "var funcs = arguments,\n    length = funcs.length;\nif (length > 1) {\n  for (var index = 1; index < length; index++) {\n    result[funcs[index]] = bind(result[funcs[index]], result)\n  }\n  return result\n}",
					inLoop : "if (isFunction(result[index])) {\n  result[index] = bind(result[index], result)\n}"
				});
			c.VERSION = "0.7.0",
			c.after = _,
			c.bind = ab,
			c.bindAll = vd,
			c.chain = vb,
			c.clone = q,
			c.compact = H,
			c.compose = bb,
			c.contains = gd,
			c.countBy = hd,
			c.debounce = cb,
			c.defaults = Vc,
			c.defer = eb,
			c.delay = db,
			c.difference = I,
			c.escape = lb,
			c.every = id,
			c.extend = Wc,
			c.filter = jd,
			c.find = kd,
			c.first = J,
			c.flatten = K,
			c.forEach = ld,
			c.forIn = Xc,
			c.forOwn = Yc,
			c.functions = Zc,
			c.groupBy = md,
			c.has = r,
			c.identity = mb,
			c.indexOf = L,
			c.initial = M,
			c.intersection = N,
			c.invert = $c,
			c.invoke = nd,
			c.isArguments = n,
			c.isArray = Sc,
			c.isBoolean = s,
			c.isDate = t,
			c.isElement = u,
			c.isEmpty = _c,
			c.isEqual = v,
			c.isFinite = w,
			c.isFunction = o,
			c.isNaN = y,
			c.isNull = z,
			c.isNumber = A,
			c.isObject = x,
			c.isRegExp = B,
			c.isString = C,
			c.isUndefined = D,
			c.keys = ad,
			c.last = O,
			c.lastIndexOf = P,
			c.lateBind = fb,
			c.map = od,
			c.max = Q,
			c.memoize = gb,
			c.merge = bd,
			c.min = R,
			c.mixin = nb,
			c.noConflict = ob,
			c.object = S,
			c.omit = cd,
			c.once = hb,
			c.pairs = dd,
			c.partial = ib,
			c.pick = ed,
			c.pluck = pd,
			c.random = pb,
			c.range = T,
			c.reduce = qd,
			c.reduceRight = E,
			c.reject = rd,
			c.rest = U,
			c.result = qb,
			c.shuffle = V,
			c.size = F,
			c.some = sd,
			c.sortBy = td,
			c.sortedIndex = W,
			c.tap = wb,
			c.template = rb,
			c.throttle = jb,
			c.times = sb,
			c.toArray = G,
			c.unescape = tb,
			c.union = X,
			c.uniq = Y,
			c.uniqueId = ub,
			c.values = fd,
			c.where = ud,
			c.without = Z,
			c.wrap = kb,
			c.zip = $,
			c.all = id,
			c.any = sd,
			c.collect = od,
			c.detect = kd,
			c.drop = U,
			c.each = ld,
			c.foldl = qd,
			c.foldr = E,
			c.head = J,
			c.include = gd,
			c.inject = qd,
			c.methods = Zc,
			c.select = jd,
			c.tail = U,
			c.take = J,
			c.unique = Y,
			c._iteratorTemplate = Ic,
			c._shimKeys = Uc,
			d.prototype = c.prototype,
			nb(c),
			d.prototype.chain = xb,
			d.prototype.value = yb,
			ld(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (a) {
				var b = Ab[a];
				d.prototype[a] = function () {
					var a = this.__wrapped__;
					return b.apply(a, arguments),
					Db && 0 === a.length && delete a[0],
					this.__chain__ && (a = new d(a), a.__chain__ = !0),
					a
				}
			}),
			ld(["concat", "join", "slice"], function (a) {
				var b = Ab[a];
				d.prototype[a] = function () {
					var a = this.__wrapped__,
					c = b.apply(a, arguments);
					return this.__chain__ && (c = new d(c), c.__chain__ = !0),
					c
				}
			}),
			"function" == typeof define && "object" == typeof define.amd && define.amd ? (a._ = c, define("lodash", [], function () {
					return c
				})) : zb ? "object" == typeof module && module && module.exports == zb ? (module.exports = c)._ = c : zb._ = c : a._ = c
		}
			(this), define("libs/backbone", ["lodash", "jquery"], function (a, b) {
				var c = {};
				return c._ = a,
				c.jQuery = b,
				function () {
					var a,
					b = this,
					c = b.Backbone,
					d = [],
					e = d.push,
					f = d.slice,
					g = d.splice;
					a = "undefined" != typeof exports ? exports : b.Backbone = {},
					a.VERSION = "1.0.0";
					var h = b._;
					a.$ = b.jQuery || b.Zepto || b.ender || b.$,
					a.noConflict = function () {
						return b.Backbone = c,
						this
					},
					a.emulateHTTP = !1,
					a.emulateJSON = !1;
					var i = a.Events = {
						on : function (a, b, c) {
							if (!k(this, "on", a, [b, c]) || !b)
								return this;
							this._events || (this._events = {});
							var d = this._events[a] || (this._events[a] = []);
							return d.push({
								callback : b,
								context : c,
								ctx : c || this
							}),
							this
						},
						once : function (a, b, c) {
							if (!k(this, "once", a, [b, c]) || !b)
								return this;
							var d = this,
							e = h.once(function () {
									d.off(a, e),
									b.apply(this, arguments)
								});
							return e._callback = b,
							this.on(a, e, c)
						},
						off : function (a, b, c) {
							var d,
							e,
							f,
							g,
							i,
							j,
							l,
							m;
							if (!this._events || !k(this, "off", a, [b, c]))
								return this;
							if (!a && !b && !c)
								return this._events = {},
							this;
							for (g = a ? [a] : h.keys(this._events), i = 0, j = g.length; j > i; i++)
								if (a = g[i], f = this._events[a]) {
									if (this._events[a] = d = [], b || c)
										for (l = 0, m = f.length; m > l; l++)
											e = f[l], (b && b !== e.callback && b !== e.callback._callback || c && c !== e.context) && d.push(e);
									d.length || delete this._events[a]
								}
							return this
						},
						trigger : function (a) {
							if (!this._events)
								return this;
							var b = f.call(arguments, 1);
							if (!k(this, "trigger", a, b))
								return this;
							var c = this._events[a],
							d = this._events.all;
							return c && l(c, b),
							d && l(d, arguments),
							this
						},
						stopListening : function (a, b, c) {
							var d = this._listeners;
							if (!d)
								return this;
							var e = !b && !c;
							"object" == typeof b && (c = this),
							a && ((d = {})[a._listenerId] = a);
							for (var f in d)
								d[f].off(b, c, this), e && delete this._listeners[f];
							return this
						}
					},
					j = /\s+/,
					k = function (a, b, c, d) {
						if (!c)
							return !0;
						if ("object" == typeof c) {
							for (var e in c)
								a[b].apply(a, [e, c[e]].concat(d));
							return !1
						}
						if (j.test(c)) {
							for (var f = c.split(j), g = 0, h = f.length; h > g; g++)
								a[b].apply(a, [f[g]].concat(d));
							return !1
						}
						return !0
					},
					l = function (a, b) {
						var c,
						d = -1,
						e = a.length,
						f = b[0],
						g = b[1],
						h = b[2];
						switch (b.length) {
						case 0:
							for (; ++d < e; )
								(c = a[d]).callback.call(c.ctx);
							return;
						case 1:
							for (; ++d < e; )
								(c = a[d]).callback.call(c.ctx, f);
							return;
						case 2:
							for (; ++d < e; )
								(c = a[d]).callback.call(c.ctx, f, g);
							return;
						case 3:
							for (; ++d < e; )
								(c = a[d]).callback.call(c.ctx, f, g, h);
							return;
						default:
							for (; ++d < e; )
								(c = a[d]).callback.apply(c.ctx, b)
						}
					},
					m = {
						listenTo : "on",
						listenToOnce : "once"
					};
					h.each(m, function (a, b) {
						i[b] = function (b, c, d) {
							var e = this._listeners || (this._listeners = {}),
							f = b._listenerId || (b._listenerId = h.uniqueId("l"));
							return e[f] = b,
							"object" == typeof c && (d = this),
							b[a](c, d, this),
							this
						}
					}),
					i.bind = i.on,
					i.unbind = i.off,
					h.extend(a, i);
					var n = a.Model = function (a, b) {
						var c,
						d = a || {};
						b || (b = {}),
						this.cid = h.uniqueId("c"),
						this.attributes = {},
						h.extend(this, h.pick(b, o)),
						b.parse && (d = this.parse(d, b) || {}),
						(c = h.result(this, "defaults")) && (d = h.defaults({}, d, c)),
						this.set(d, b),
						this.changed = {},
						this.initialize.apply(this, arguments)
					},
					o = ["url", "urlRoot", "collection"];
					h.extend(n.prototype, i, {
						changed : null,
						validationError : null,
						idAttribute : "id",
						initialize : function () {},
						toJSON : function () {
							return h.clone(this.attributes)
						},
						sync : function () {
							return a.sync.apply(this, arguments)
						},
						get : function (a) {
							return this.attributes[a]
						},
						escape : function (a) {
							return h.escape(this.get(a))
						},
						has : function (a) {
							return null != this.get(a)
						},
						set : function (a, b, c) {
							var d,
							e,
							f,
							g,
							i,
							j,
							k,
							l;
							if (null == a)
								return this;
							if ("object" == typeof a ? (e = a, c = b) : (e = {})[a] = b, c || (c = {}), !this._validate(e, c))
								return !1;
							f = c.unset,
							i = c.silent,
							g = [],
							j = this._changing,
							this._changing = !0,
							j || (this.changed = {}),
							l = this.attributes,
							k = this._previousAttributes,
							this.idAttribute in e && (this.id = e[this.idAttribute]);
							for (d in e)
								b = e[d], h.isEqual(l[d], b) || g.push(d), f ? delete l[d] : l[d] = b;
							if (!i) {
								g.length && (this._pending = !0),
								c.changes = g;
								for (var m = 0, n = g.length; n > m; m++)
									this.trigger("change:" + g[m], this, l[g[m]], c)
							}
							if (j)
								return this;
							if (!i)
								for (; this._pending; )
									this._pending = !1, this.trigger("change", this, c);
							return this._pending = !1,
							this._changing = !1,
							this
						},
						unset : function (a, b) {
							return this.set(a, void 0, h.extend({}, b, {
									unset : !0
								}))
						},
						clear : function (a) {
							var b = {};
							for (var c in this.attributes)
								b[c] = void 0;
							return this.set(b, h.extend({}, a, {
									unset : !0
								}))
						},
						hasChanged : function (a) {
							return null == a ? !h.isEmpty(this.changed) : h.has(this.changed, a)
						},
						changedAttributes : function (a) {
							if (!a)
								return this.hasChanged() ? h.clone(this.changed) : !1;
							var b,
							c = !1,
							d = this._changing ? this._previousAttributes : this.attributes;
							for (var e in a)
								h.isEqual(d[e], b = a[e]) || ((c || (c = {}))[e] = b);
							return c
						},
						previous : function (a) {
							return null != a && this._previousAttributes ? this._previousAttributes[a] : null
						},
						previousAttributes : function () {
							return h.clone(this._previousAttributes)
						},
						fetch : function (a) {
							a = a ? h.clone(a) : {},
							void 0 === a.parse && (a.parse = !0);
							var b = this,
							c = a.success;
							return a.success = function (d) {
								return b.set(b.parse(d, a), a) ? (c && c(b, d, a), b.trigger("sync", b, d, a), void 0) : !1
							},
							L(this, a),
							this.sync("read", this, a)
						},
						save : function (a, b, c) {
							var d,
							e,
							f,
							g = this.attributes;
							if (null == a || "object" == typeof a ? (d = a, c = b) : (d = {})[a] = b, !(!d || c && c.wait || this.set(d, c)))
								return !1;
							if (c = h.extend({
										validate : !0
									}, c), !this._validate(d, c))
								return !1;
							d && c.wait && (this.attributes = h.extend({}, g, d)),
							void 0 === c.parse && (c.parse = !0);
							var i = this,
							j = c.success;
							return c.success = function (a) {
								i.attributes = g;
								var b = i.parse(a, c);
								return c.wait && (b = h.extend(d || {}, b)),
								h.isObject(b) && !i.set(b, c) ? !1 : (j && j(i, a, c), i.trigger("sync", i, a, c), void 0)
							},
							L(this, c),
							e = this.isNew() ? "create" : c.patch ? "patch" : "update",
							"patch" === e && (c.attrs = d),
							f = this.sync(e, this, c),
							d && c.wait && (this.attributes = g),
							f
						},
						destroy : function (a) {
							a = a ? h.clone(a) : {};
							var b = this,
							c = a.success,
							d = function () {
								b.trigger("destroy", b, b.collection, a)
							};
							if (a.success = function (e) {
								(a.wait || b.isNew()) && d(),
								c && c(b, e, a),
								b.isNew() || b.trigger("sync", b, e, a)
							}, this.isNew())
								return a.success(), !1;
							L(this, a);
							var e = this.sync("delete", this, a);
							return a.wait || d(),
							e
						},
						url : function () {
							var a = h.result(this, "urlRoot") || h.result(this.collection, "url") || K();
							return this.isNew() ? a : a + ("/" === a.charAt(a.length - 1) ? "" : "/") + encodeURIComponent(this.id)
						},
						parse : function (a) {
							return a
						},
						clone : function () {
							return new this.constructor(this.attributes)
						},
						isNew : function () {
							return null == this.id
						},
						isValid : function (a) {
							return this._validate({}, h.extend(a || {}, {
									validate : !0
								}))
						},
						_validate : function (a, b) {
							if (!b.validate || !this.validate)
								return !0;
							a = h.extend({}, this.attributes, a);
							var c = this.validationError = this.validate(a, b) || null;
							return c ? (this.trigger("invalid", this, c, h.extend(b || {}, {
										validationError : c
									})), !1) : !0
						}
					});
					var p = ["keys", "values", "pairs", "invert", "pick", "omit"];
					h.each(p, function (a) {
						n.prototype[a] = function () {
							var b = f.call(arguments);
							return b.unshift(this.attributes),
							h[a].apply(h, b)
						}
					});
					var q = a.Collection = function (a, b) {
						b || (b = {}),
						b.url && (this.url = b.url),
						b.model && (this.model = b.model),
						void 0 !== b.comparator && (this.comparator = b.comparator),
						this._reset(),
						this.initialize.apply(this, arguments),
						a && this.reset(a, h.extend({
								silent : !0
							}, b))
					},
					r = {
						add : !0,
						remove : !0,
						merge : !0
					},
					s = {
						add : !0,
						merge : !1,
						remove : !1
					};
					h.extend(q.prototype, i, {
						model : n,
						initialize : function () {},
						toJSON : function (a) {
							return this.map(function (b) {
								return b.toJSON(a)
							})
						},
						sync : function () {
							return a.sync.apply(this, arguments)
						},
						add : function (a, b) {
							return this.set(a, h.defaults(b || {}, s))
						},
						remove : function (a, b) {
							a = h.isArray(a) ? a.slice() : [a],
							b || (b = {});
							var c,
							d,
							e,
							f;
							for (c = 0, d = a.length; d > c; c++)
								f = this.get(a[c]), f && (delete this._byId[f.id], delete this._byId[f.cid], e = this.indexOf(f), this.models.splice(e, 1), this.length--, b.silent || (b.index = e, f.trigger("remove", f, this, b)), this._removeReference(f));
							return this
						},
						set : function (a, b) {
							b = h.defaults(b || {}, r),
							b.parse && (a = this.parse(a, b)),
							h.isArray(a) || (a = a ? [a] : []);
							var c,
							d,
							f,
							i,
							j,
							k = b.at,
							l = this.comparator && null == k && b.sort !== !1,
							m = h.isString(this.comparator) ? this.comparator : null,
							n = [],
							o = [],
							p = {};
							for (c = 0, d = a.length; d > c; c++)
								(f = this._prepareModel(a[c], b)) && ((i = this.get(f)) ? (b.remove && (p[i.cid] = !0), b.merge && (i.set(f.attributes, b), l && !j && i.hasChanged(m) && (j = !0))) : b.add && (n.push(f), f.on("all", this._onModelEvent, this), this._byId[f.cid] = f, null != f.id && (this._byId[f.id] = f)));
							if (b.remove) {
								for (c = 0, d = this.length; d > c; ++c)
									p[(f = this.models[c]).cid] || o.push(f);
								o.length && this.remove(o, b)
							}
							if (n.length && (l && (j = !0), this.length += n.length, null != k ? g.apply(this.models, [k, 0].concat(n)) : e.apply(this.models, n)), j && this.sort({
									silent : !0
								}), b.silent)
								return this;
							for (c = 0, d = n.length; d > c; c++)
								(f = n[c]).trigger("add", f, this, b);
							return j && this.trigger("sort", this, b),
							this
						},
						reset : function (a, b) {
							b || (b = {});
							for (var c = 0, d = this.models.length; d > c; c++)
								this._removeReference(this.models[c]);
							return b.previousModels = this.models,
							this._reset(),
							this.add(a, h.extend({
									silent : !0
								}, b)),
							b.silent || this.trigger("reset", this, b),
							this
						},
						push : function (a, b) {
							return a = this._prepareModel(a, b),
							this.add(a, h.extend({
									at : this.length
								}, b)),
							a
						},
						pop : function (a) {
							var b = this.at(this.length - 1);
							return this.remove(b, a),
							b
						},
						unshift : function (a, b) {
							return a = this._prepareModel(a, b),
							this.add(a, h.extend({
									at : 0
								}, b)),
							a
						},
						shift : function (a) {
							var b = this.at(0);
							return this.remove(b, a),
							b
						},
						slice : function (a, b) {
							return this.models.slice(a, b)
						},
						get : function (a) {
							return null == a ? void 0 : this._byId[null != a.id ? a.id : a.cid || a]
						},
						at : function (a) {
							return this.models[a]
						},
						where : function (a, b) {
							return h.isEmpty(a) ? b ? void 0 : [] : this[b ? "find" : "filter"](function (b) {
								for (var c in a)
									if (a[c] !== b.get(c))
										return !1;
								return !0
							})
						},
						findWhere : function (a) {
							return this.where(a, !0)
						},
						sort : function (a) {
							if (!this.comparator)
								throw new Error("Cannot sort a set without a comparator");
							return a || (a = {}),
							h.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(h.bind(this.comparator, this)),
							a.silent || this.trigger("sort", this, a),
							this
						},
						sortedIndex : function (a, b, c) {
							b || (b = this.comparator);
							var d = h.isFunction(b) ? b : function (a) {
								return a.get(b)
							};
							return h.sortedIndex(this.models, a, d, c)
						},
						pluck : function (a) {
							return h.invoke(this.models, "get", a)
						},
						fetch : function (a) {
							a = a ? h.clone(a) : {},
							void 0 === a.parse && (a.parse = !0);
							var b = a.success,
							c = this;
							return a.success = function (d) {
								var e = a.reset ? "reset" : "set";
								c[e](d, a),
								b && b(c, d, a),
								c.trigger("sync", c, d, a)
							},
							L(this, a),
							this.sync("read", this, a)
						},
						create : function (a, b) {
							if (b = b ? h.clone(b) : {}, !(a = this._prepareModel(a, b)))
								return !1;
							b.wait || this.add(a, b);
							var c = this,
							d = b.success;
							return b.success = function (e) {
								b.wait && c.add(a, b),
								d && d(a, e, b)
							},
							a.save(null, b),
							a
						},
						parse : function (a) {
							return a
						},
						clone : function () {
							return new this.constructor(this.models)
						},
						_reset : function () {
							this.length = 0,
							this.models = [],
							this._byId = {}

						},
						_prepareModel : function (a, b) {
							if (a instanceof n)
								return a.collection || (a.collection = this), a;
							b || (b = {}),
							b.collection = this;
							var c = new this.model(a, b);
							return c._validate(a, b) ? c : (this.trigger("invalid", this, a, b), !1)
						},
						_removeReference : function (a) {
							this === a.collection && delete a.collection,
							a.off("all", this._onModelEvent, this)
						},
						_onModelEvent : function (a, b, c, d) {
							("add" !== a && "remove" !== a || c === this) && ("destroy" === a && this.remove(b, d), b && a === "change:" + b.idAttribute && (delete this._byId[b.previous(b.idAttribute)], null != b.id && (this._byId[b.id] = b)), this.trigger.apply(this, arguments))
						}
					});
					var t = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain"];
					h.each(t, function (a) {
						q.prototype[a] = function () {
							var b = f.call(arguments);
							return b.unshift(this.models),
							h[a].apply(h, b)
						}
					});
					var u = ["groupBy", "countBy", "sortBy"];
					h.each(u, function (a) {
						q.prototype[a] = function (b, c) {
							var d = h.isFunction(b) ? b : function (a) {
								return a.get(b)
							};
							return h[a](this.models, d, c)
						}
					});
					var v = a.View = function (a) {
						this.cid = h.uniqueId("view"),
						this._configure(a || {}),
						this._ensureElement(),
						this.initialize.apply(this, arguments),
						this.delegateEvents()
					},
					w = /^(\S+)\s*(.*)$/,
					x = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
					h.extend(v.prototype, i, {
						tagName : "div",
						$ : function (a) {
							return this.$el.find(a)
						},
						initialize : function () {},
						render : function () {
							return this
						},
						remove : function () {
							return this.$el.remove(),
							this.stopListening(),
							this
						},
						setElement : function (b, c) {
							return this.$el && this.undelegateEvents(),
							this.$el = b instanceof a.$ ? b : a.$(b),
							this.el = this.$el[0],
							c !== !1 && this.delegateEvents(),
							this
						},
						delegateEvents : function (a) {
							if (!a && !(a = h.result(this, "events")))
								return this;
							this.undelegateEvents();
							for (var b in a) {
								var c = a[b];
								if (h.isFunction(c) || (c = this[a[b]]), c) {
									var d = b.match(w),
									e = d[1],
									f = d[2];
									c = h.bind(c, this),
									e += ".delegateEvents" + this.cid,
									"" === f ? this.$el.on(e, c) : this.$el.on(e, f, c)
								}
							}
							return this
						},
						undelegateEvents : function () {
							return this.$el.off(".delegateEvents" + this.cid),
							this
						},
						_configure : function (a) {
							this.options && (a = h.extend({}, h.result(this, "options"), a)),
							h.extend(this, h.pick(a, x)),
							this.options = a
						},
						_ensureElement : function () {
							if (this.el)
								this.setElement(h.result(this, "el"), !1);
							else {
								var b = h.extend({}, h.result(this, "attributes"));
								this.id && (b.id = h.result(this, "id")),
								this.className && (b["class"] = h.result(this, "className"));
								var c = a.$("<" + h.result(this, "tagName") + ">").attr(b);
								this.setElement(c, !1)
							}
						}
					}),
					a.sync = function (b, c, d) {
						var e = y[b];
						h.defaults(d || (d = {}), {
							emulateHTTP : a.emulateHTTP,
							emulateJSON : a.emulateJSON
						});
						var f = {
							type : e,
							dataType : "json"
						};
						if (d.url || (f.url = h.result(c, "url") || K()), null != d.data || !c || "create" !== b && "update" !== b && "patch" !== b || (f.contentType = "application/json", f.data = JSON.stringify(d.attrs || c.toJSON(d))), d.emulateJSON && (f.contentType = "application/x-www-form-urlencoded", f.data = f.data ? {
									model : f.data
								}
								 : {}), d.emulateHTTP && ("PUT" === e || "DELETE" === e || "PATCH" === e)) {
							f.type = "POST",
							d.emulateJSON && (f.data._method = e);
							var g = d.beforeSend;
							d.beforeSend = function (a) {
								return a.setRequestHeader("X-HTTP-Method-Override", e),
								g ? g.apply(this, arguments) : void 0
							}
						}
						"GET" === f.type || d.emulateJSON || (f.processData = !1),
						"PATCH" !== f.type || !window.ActiveXObject || window.external && window.external.msActiveXFilteringEnabled || (f.xhr = function () {
							return new ActiveXObject("Microsoft.XMLHTTP")
						});
						var i = d.xhr = a.ajax(h.extend(f, d));
						return c.trigger("request", c, i, d),
						i
					};
					var y = {
						create : "POST",
						update : "PUT",
						patch : "PATCH",
						"delete" : "DELETE",
						read : "GET"
					};
					a.ajax = function () {
						return a.$.ajax.apply(a.$, arguments)
					};
					var z = a.Router = function (a) {
						a || (a = {}),
						a.routes && (this.routes = a.routes),
						this._bindRoutes(),
						this.initialize.apply(this, arguments)
					},
					A = /\((.*?)\)/g,
					B = /(\(\?)?:\w+/g,
					C = /\*\w+/g,
					D = /[\-{}\[\]+?.,\\\^$|#\s]/g;
					h.extend(z.prototype, i, {
						initialize : function () {},
						route : function (b, c, d) {
							h.isRegExp(b) || (b = this._routeToRegExp(b)),
							h.isFunction(c) && (d = c, c = ""),
							d || (d = this[c]);
							var e = this;
							return a.history.route(b, function (f) {
								var g = e._extractParameters(b, f);
								d && d.apply(e, g),
								e.trigger.apply(e, ["route:" + c].concat(g)),
								e.trigger("route", c, g),
								a.history.trigger("route", e, c, g)
							}),
							this
						},
						navigate : function (b, c) {
							return a.history.navigate(b, c),
							this
						},
						_bindRoutes : function () {
							if (this.routes) {
								this.routes = h.result(this, "routes");
								for (var a, b = h.keys(this.routes); null != (a = b.pop()); )
									this.route(a, this.routes[a])
							}
						},
						_routeToRegExp : function (a) {
							return a = a.replace(D, "\\$&").replace(A, "(?:$1)?").replace(B, function (a, b) {
									return b ? a : "([^/]+)"
								}).replace(C, "(.*?)"),
							new RegExp("^" + a + "$")
						},
						_extractParameters : function (a, b) {
							var c = a.exec(b).slice(1);
							return h.map(c, function (a) {
								return a ? decodeURIComponent(a) : null
							})
						}
					});
					var E = a.History = function () {
						this.handlers = [],
						h.bindAll(this, "checkUrl"),
						"undefined" != typeof window && (this.location = window.location, this.history = window.history)
					},
					F = /^[#\/]|\s+$/g,
					G = /^\/+|\/+$/g,
					H = /msie [\w.]+/,
					I = /\/$/;
					E.started = !1,
					h.extend(E.prototype, i, {
						interval : 50,
						getHash : function (a) {
							var b = (a || this).location.href.match(/#(.*)$/);
							return b ? b[1] : ""
						},
						getFragment : function (a, b) {
							if (null == a)
								if (this._hasPushState || !this._wantsHashChange || b) {
									a = this.location.pathname;
									var c = this.root.replace(I, "");
									a.indexOf(c) || (a = a.substr(c.length))
								} else
									a = this.getHash();
							return a.replace(F, "")
						},
						start : function (b) {
							if (E.started)
								throw new Error("Backbone.history has already been started");
							E.started = !0,
							this.options = h.extend({}, {
									root : "/"
								}, this.options, b),
							this.root = this.options.root,
							this._wantsHashChange = this.options.hashChange !== !1,
							this._wantsPushState = !!this.options.pushState,
							this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
							var c = this.getFragment(),
							d = document.documentMode,
							e = H.exec(navigator.userAgent.toLowerCase()) && (!d || 7 >= d);
							this.root = ("/" + this.root + "/").replace(G, "/"),
							e && this._wantsHashChange && (this.iframe = a.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(c)),
							this._hasPushState ? a.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !e ? a.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)),
							this.fragment = c;
							var f = this.location,
							g = f.pathname.replace(/[^\/]$/, "$&/") === this.root;
							return this._wantsHashChange && this._wantsPushState && !this._hasPushState && !g ? (this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0) : (this._wantsPushState && this._hasPushState && g && f.hash && (this.fragment = this.getHash().replace(F, ""), this.history.replaceState({}, document.title, this.root + this.fragment + f.search)), this.options.silent ? void 0 : this.loadUrl())
						},
						stop : function () {
							a.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl),
							clearInterval(this._checkUrlInterval),
							E.started = !1
						},
						route : function (a, b) {
							this.handlers.unshift({
								route : a,
								callback : b
							})
						},
						checkUrl : function () {
							var a = this.getFragment();
							return a === this.fragment && this.iframe && (a = this.getFragment(this.getHash(this.iframe))),
							a === this.fragment ? !1 : (this.iframe && this.navigate(a), this.loadUrl() || this.loadUrl(this.getHash()), void 0)
						},
						loadUrl : function (a) {
							var b = this.fragment = this.getFragment(a),
							c = h.any(this.handlers, function (a) {
									return a.route.test(b) ? (a.callback(b), !0) : void 0
								});
							return c
						},
						navigate : function (a, b) {
							if (!E.started)
								return !1;
							if (b && b !== !0 || (b = {
										trigger : b
									}), a = this.getFragment(a || ""), this.fragment !== a) {
								this.fragment = a;
								var c = this.root + a;
								if (this._hasPushState)
									this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, c);
								else {
									if (!this._wantsHashChange)
										return this.location.assign(c);
									this._updateHash(this.location, a, b.replace),
									this.iframe && a !== this.getFragment(this.getHash(this.iframe)) && (b.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, a, b.replace))
								}
								b.trigger && this.loadUrl(a)
							}
						},
						_updateHash : function (a, b, c) {
							if (c) {
								var d = a.href.replace(/(javascript:|#).*$/, "");
								a.replace(d + "#" + b)
							} else
								a.hash = "#" + b
						}
					}),
					a.history = new E;
					var J = function (a, b) {
						var c,
						d = this;
						c = a && h.has(a, "constructor") ? a.constructor : function () {
							return d.apply(this, arguments)
						},
						h.extend(c, d, b);
						var e = function () {
							this.constructor = c
						};
						return e.prototype = d.prototype,
						c.prototype = new e,
						a && h.extend(c.prototype, a),
						c.__super__ = d.prototype,
						c
					};
					n.extend = q.extend = z.extend = v.extend = E.extend = J;
					var K = function () {
						throw new Error('A "url" property or function must be specified')
					},
					L = function (a, b) {
						var c = b.error;
						b.error = function (d) {
							c && c(a, d, b),
							a.trigger("error", a, d, b)
						}
					}
				}
				.call(c),
				c.Backbone
			}), define("libs/etch", ["libs/backbone"], function (b) {
				"use strict";
				function c(a) {
					var b = a.target.dataset.value;
					return null == b && ($target = $(a.target), b = $target.parent()[0].dataset.value),
					b
				}
				var d = {},
				e = {},
				f = {},
				g = {};
				return g.VERSION = "0.6.2",
				g.config = {
					selector : ".editable",
					buttonClasses : {
						"default" : ["save"],
						all : ["bold", "italic", "underline", "unordered-list", "ordered-list", "link", "clear-formatting", "save"],
						title : ["bold", "italic", "underline", "save"]
					}
				},
				d.Editor = b.Model.extend({
						constructor : function () {
							b.Model.prototype.constructor.apply(this, arguments)
						}
					}),
				e.Editor = b.View.extend({
						constructor : function () {
							b.View.prototype.constructor.apply(this, arguments)
						},
						initialize : function () {
							this.$el = $(this.el),
							_.bindAll(this, "changeButtons", "changePosition", "changeEditable", "insertImage", "_editableModelChanged"),
							this.model.bind("change:buttons", this.changeButtons, this),
							this.model.bind("change:position", this.changePosition, this),
							this.model.bind("change:editable", this.changeEditable, this),
							this.model.bind("caretUpdated", this._caretUpdated, this),
							this.model.bind("spectrum:hide", this._hideSpectrum, this),
							this.model.on("change:editableModel", this._editableModelChanged, this),
							this._editableModelChanged(this.model, this.model.get("editableModel")),
							this.changeEditable()
						},
						events : {
							"click .etch-bold" : "toggleBold",
							"click .etch-italic" : "toggleItalic",
							"click .etch-underline" : "toggleUnderline",
							"click .etch-heading" : "toggleHeading",
							"click .etch-unordered-list" : "toggleUnorderedList",
							"click .etch-justify-left" : "justifyLeft",
							"click .etch-justify-center" : "justifyCenter",
							"click .etch-justify-right" : "justifyRight",
							"click .etch-ordered-list" : "toggleOrderedList",
							"click .etch-link" : "toggleLink",
							"click .etch-image" : "getImage",
							"click .etch-save" : "save",
							"click .etch-clear-formatting" : "clearFormatting",
							'click [data-option="fontSize"]' : "setFontSize",
							'click [data-option="fontFamily"]' : "setFontFamily"
						},
						_editableModelChanged : function (a, b) {
							null != this._lastEditableModel && this._lastEditableModel.off(null, null, this),
							this._lastEditableModel = b,
							b.on("change:size", this._fontSizeChanged, this)
						},
						_hideSpectrum : function () {
							this.$colorChooser.spectrum("hide")
						},
						_caretUpdated : function () {
							var b = $(a(window)),
							c = b.attr("color"),
							d = b.attr("face");
							c = c || b.parents("font").attr("color") || "#333",
							d = d || b.parents("font").attr("face") || "Lato",
							d && (d = d.split(",")[0]),
							this.$fontFamilyReadout.html(d),
							this.$colorChooser.spectrum("set", c)
						},
						changeEditable : function () {
							this.setButtonClass()
						},
						setButtonClass : function () {
							var a = this.model,
							b = a.get("editable").attr("data-button-class") || "default";
							a.set({
								buttons : g.config.buttonClasses[b]
							})
						},
						_fontSizeChanged : function (a, b) {
							this.$fontSizeReadout.text(b)
						},
						changeButtons : function () {
							console.log("Change btns"),
							this.$el.empty();
							var a = this,
							c = this.model.get("buttons");
							if (!c.length)
								return $(this.el).hide(), void 0;
							var d = a.$el;
							_.each(this.model.get("buttons"), function (b) {
								if ("<group>" == b)
									d = g.groupElFactory(), a.$el.append(d);
								else if ("</group>" == b)
									d = a.$el;
								else {
									var c = g.buttonElFactory(b);
									d.append(c)
								}
							}),
							$(this.el).show("fast");
							var e = this.$el.find(".color-chooser");
							if (e.length > 0) {
								var f = "333";
								e.spectrum({
									color : "#" + f,
									showSelectionPalette : !0,
									localStorageKey : "strut.fontColorChooser",
									showPalette : !0,
									showInitial : !0,
									showInput : !0,
									palette : [],
									clickoutFiresChange : !0,
									theme : "sp-dark",
									move : function (a) {
										document.execCommand("foreColor", !1, a.toHexString())
									},
									change : function (a) {
										b.trigger("etch:state", {
											color : a.toHexString()
										})
									}
								});
								var h = function (a) {
									a.preventDefault()
								};
								$(".sp-replacer").mousedown(h),
								$(".sp-container").mousedown(h),
								e.mousedown(h),
								e.find("div").css("backgroundColor", "#" + f)
							}
							var i = this.$el.find(".dropdown-toggle");
							i.dropdown(),
							this.$fontSizeReadout = this.$el.find(".fontSizeReadout"),
							this.$colorChooser = e,
							this.$fontFamilyReadout = this.$el.find(".fontFamilyBtn > .text")
						},
						changePosition : function () {
							var a = this.model.get("position");
							this.$el.animate({
								top : a.y,
								left : a.x
							}, {
								queue : !1,
								duration : 300
							})
						},
						wrapSelection : function (a, b) {
							var c = a === Range ? a : a.getRangeAt(0),
							d = document.createElement(b);
							c.surroundContents(d)
						},
						clearFormatting : function (a) {
							a.preventDefault(),
							document.execCommand("removeFormat", !1, null)
						},
						setFontFamily : function (a) {
							a.preventDefault();
							var d = c(a);
							document.execCommand("fontName", !1, d),
							d = d.substr(d.indexOf("'") + 1, d.lastIndexOf("'") - 1),
							this.$el.find(".fontFamilyBtn .text").text(d),
							b.trigger("etch:state", {
								face : d
							})
						},
						setFontSize : function (a) {
							var d = this.model.get("editableModel"),
							e = c(a);
							d.set("size", e |= 0),
							this.$el.find(".fontSizeBtn .text").text(e),
							b.trigger("etch:state", {
								size : e
							})
						},
						toggleBold : function (a) {
							a.preventDefault(),
							document.execCommand("bold", !1, null)
						},
						toggleItalic : function (a) {
							a.preventDefault(),
							document.execCommand("italic", !1, null)
						},
						toggleUnderline : function (a) {
							a.preventDefault(),
							document.execCommand("underline", !1, null)
						},
						toggleHeading : function (a) {
							a.preventDefault();
							var b = window.getSelection().getRangeAt(0),
							c = b.commonAncestorContainer.parentElement;
							if ($(c).is("h3"))
								return $(c).replaceWith(c.textContent), void 0;
							var d = document.createElement("h3");
							b.surroundContents(d)
						},
						urlPrompt : function (a) {
							var b = prompt("Enter a url", "http://");
							/^((http|https)...)/.test(b) ? a(b) : a("http://" + b)
						},
						toggleLink : function (a) {
							a.preventDefault();
							var b = window.getSelection().getRangeAt(0);
							"A" === b.startContainer.parentNode.tagName || "A" === b.endContainer.parentNode.tagName ? document.execCommand("unlink", !1, null) : this.urlPrompt(function (a) {
								document.execCommand("createLink", !1, a)
							})
						},
						toggleUnorderedList : function (a) {
							a.preventDefault(),
							document.execCommand("insertUnorderedList", !1, null)
						},
						toggleOrderedList : function (a) {
							a.preventDefault(),
							document.execCommand("insertOrderedList", !1, null)
						},
						justifyLeft : function (a) {
							a.preventDefault(),
							document.execCommand("justifyLeft", !1, null)
						},
						justifyCenter : function (a) {
							a.preventDefault(),
							document.execCommand("justifyCenter", !1, null)
						},
						justifyRight : function (a) {
							a.preventDefault(),
							document.execCommand("justifyRight", !1, null)
						},
						getImage : function (a) {
							a.preventDefault(),
							this.startUploader(this.insertImage)
						},
						startUploader : function (a) {
							var b = new d.ImageUploader,
							c = new e.ImageUploader({
									model : b
								});
							b._imageCallback = function (b) {
								c.startCropper(b, a)
							},
							this._savedRange = window.getSelection().getRangeAt(0),
							$("body").append(c.render().el)
						},
						insertImage : function (a) {
							var b = window.getSelection();
							b.removeAllRanges(),
							b.addRange(this._savedRange);
							var c = {
								editable : this.model.get("editable"),
								editableModel : this.model.get("editableModel")
							};
							_.extend(c, a);
							var f = new d.EditableImage(c),
							g = new e.EditableImage({
									model : f
								});
							this._savedRange.insertNode($(g.render().el).addClass("etch-float-left")[0])
						},
						save : function (a) {
							a.preventDefault();
							var b = this.model.get("editableModel");
							b.trigger("save")
						}
					}),
				_.extend(g, {
					models : d,
					views : e,
					collections : f,
					triggerCaret : function () {
						var a = $(".etch-editor-panel").data("model");
						a.trigger("caretUpdated")
					},
					editableInit : function (a, b) {
						a.stopPropagation();
						var c = a.target || a.srcElement,
						f = $(c).etchFindEditable(),
						h = $(".etch-editor-panel"),
						i = h.data("model");
						if (h.size())
							f[0] !== i.get("editable")[0] ? (i.set({
									editable : f,
									editableModel : this.model
								}), h.css("display", "block")) : h.css("display", "block");
						else {
							h = $('<div class="etch-editor-panel">');
							var j = {
								editable : f,
								editableModel : this.model
							};
							document.body.appendChild(h[0]),
							h.etchInstantiate({
								classType : "Editor",
								attrs : j
							}),
							i = h.data("model")
						}
						try {
							document.execCommand("StyleWithCSS", !1, !1)
						} catch (k) {
							"Invalid argument." !== k.message
						}
						if (d.EditableImage) {
							var l = f.find("img");
							if (l.size()) {
								var m = {
									editable : f,
									editableModel : this.model
								};
								l.each(function () {
									var a = $(this);
									if (!a.data("editableImageModel")) {
										var b = new d.EditableImage(m);
										new e.EditableImage({
											model : b,
											el : this,
											tagName : this.tagName
										}),
										a.data("editableImageModel", b)
									}
								})
							}
						}
						$("body").bind("mousedown.editor", function (a) {
							var b = a.target || a.srcElement;
							$(b).not(".sp-container *, .colorpicker *, .etch-editor-panel, .etch-editor-panel *, .etch-image-tools, .etch-image-tools *").size() && (h.css("display", "none"), i.trigger("spectrum:hide", null), d.EditableImage && (f.find("img").unbind("mouseenter"), $(g.config.selector + " img").data("editableImageModel", !1)), $(this).unbind("mousedown.editor"))
						}),
						this.model.trigger("change:size", this.model, this.model.get("size"), {}),
						i.set({
							position : {
								x : a.pageX - 15,
								y : b || a.pageY - 80
							}
						})
					}
				}),
				$.fn.etchInstantiate = function (a, b) {
					return this.each(function () {
						var c = $(this);
						a || (a = {});
						var f = {
							el : this,
							attrs : {}

						};
						_.extend(f, a);
						var g = new d[f.classType](f.attrs, f);
						if (_.isFunction(e[f.classType]))
							var h = new e[f.classType]({
									model : g,
									el : this,
									tagName : this.tagName
								});
						c.data({
							model : g
						}),
						c.data({
							view : h
						}),
						_.isFunction(b) && b({
							model : g,
							view : h
						})
					})
				},
				g.buttonElFactory = function (a) {
					return $('<a href="#" class="etch-editor-button etch-' + a + '" title="' + a.replace("-", " ") + '"><span></span></a>')
				},
				$.fn.etchFindEditable = function () {
					var a = $(this);
					return a.is(g.config.selector) ? a : a.closest(g.config.selector)
				},
				g
			}), define("css", [], function () {
				function a(a) {
					if ("undefined" == typeof document)
						return b(a), void 0;
					if (!isOptimized) {
						var c = document.createElement("link");
						c.type = "text/css",
						c.rel = "stylesheet",
						c.href = a,
						document.getElementsByTagName("head")[0].appendChild(c)
					}
				}
				function b(a) {
					var b = d.readFileSync("app/" + a, "utf8");
					d.appendFileSync(e, b + "\n")
				}
				var c = void 0;
				if ("undefined" != typeof process && "undefined" != typeof nodeRequire) {
					var d = nodeRequire("fs");
					c = nodeRequire("path");
					var e = null
				}
				return {
					load : function (b, f, g) {
						c && !e && (d.existsSync("dist") || d.mkdirSync("dist"), d.existsSync("dist/styles") || d.mkdirSync("dist/styles"), e = "dist/styles/built.css"),
						a(b),
						g(null)
					}
				}
			}), define("strut/etch_extension/main", ["libs/etch", "css!styles/etch_extension/EtchOverrides.css"], function (a) {
				"use strict";
				_.extend(a.config.buttonClasses, {
					"default" : ["<group>", "bold", "italic", "</group>", "<group>", "unordered-list", "ordered-list", "</group>", "<group>", "justify-left", "justify-center", "</group>", "<group>", "link", "</group>", "font-family", "font-size", "<group>", "color", "</group>", "<group>", "clear-formatting", "</group>"]
				});
				var b = ["link", "clear-formatting", "ordered-list", "unordered-list"];
				return a.buttonElFactory = function (a) {
					var c = {
						button : a,
						title : a.replace("-", " "),
						display : a.substring(0, 1).toUpperCase()
					};
					switch (b.indexOf(a) > -1 && (c.display = ""), a) {
					case "font-size":
						return JST["strut.etch_extension/fontSizeSelection"](c);
					case "font-family":
						return JST["strut.etch_extension/fontFamilySelection"](c);
					case "color":
						return JST["strut.etch_extension/colorChooser"](c);
					default:
						return -1 !== a.indexOf("justify") ? (c.icon = a.substring(a.indexOf("-") + 1, a.length), JST["strut.etch_extension/align"](c)) : JST["strut.etch_extension/defaultButton"](c)
					}
				},
				a.groupElFactory = function () {
					return $('<div class="btn-group">')
				}, {
					initialize : function () {}

				}
			}), define("tantaman/web/widgets/FileBrowser", ["libs/backbone", "css!styles/widgets/fileBrowser.css"], function (a) {
				return a.View.extend({
					events : {
						destroyed : "dispose",
						"click li[data-filename]" : "_fileClicked",
						"click button.close" : "_deleteClicked",
						"dblclick li[data-filename]" : "_fileChosen"
					},
					className : "fileBrowser",
					initialize : function () {
						this.render = this.render.bind(this),
						this.storageInterface.on("change:currentProvider", this.render),
						this.template = JST["tantaman.web.widgets/FileBrowser"],
						this.renderListing = this.renderListing.bind(this)
					},
					render : function () {
						return this.$el.html('<div class="browserContent">'),
						this.storageInterface.providerReady(this.$el) ? this.renderListing() : this.storageInterface.activateProvider(this.$el, this.renderListing),
						this
					},
					dispose : function () {
						this.storageInterface.off(null, null, this)
					},
					_fileClicked : function (a) {
						this.$fileName.val(a.currentTarget.dataset.filename),
						this.$el.find(".active").removeClass("active"),
						$(a.currentTarget).addClass("active")
},_fileChosen:function(a){this.$el.trigger("fileChosen",a.currentTarget.dataset.fileName)},_deleteClicked:function(a){var b=$(a.currentTarget),c=b.parent().parent();return this.storageInterface.remove(c.attr("data-filename")),c.remove(),a.stopPropagation(),!1},renderListing:function(){var a=this;this.storageInterface.listPresentations("/",function(b,c){c?a.$el.find(".browserContent").html(c):a.$el.find(".browserContent").html(a.template({files:b})),a.$fileName=a.$el.find(".fileName")})},fileName:function(){return this.$fileName.val()},constructor:function(b,c){this.storageInterface=b,this.editorModel=c,a.View.prototype.constructor.call(this)}})}),define("strut/storage/view/StorageModal",["libs/backbone","tantaman/web/widgets/FileBrowser","css!styles/storage/storageModal.css"],function(a,b){return a.View.extend({className:"storageModal modal hide",events:{"click a[data-provider]":"_providerSelected","click .ok":"_okClicked",destroyed:"dispose"},initialize:function(){this.storageInterface=this.options.storageInterface,this.editorModel=this.options.editorModel,delete this.options.storageInterface,delete this.options.editorModel,this.template=JST["strut.storage/StorageModal"],this.storageInterface.on("change:providers",this.render,this),this.storageInterface.on("change:currentProvider",this._providerChanged,this),this.fileBrowser=new b(this.storageInterface,this.editorModel)},title:function(a){this.$el.find(".title").html(a)},dispose:function(){this.storageInterface.off(null,null,this)},render:function(){var a=this.storageInterface.providerNames();this.$el.html(this.template({title:this.__title(),tabs:a})),this._providerChanged(),this.$el.find(".tabContent").append(this.fileBrowser.render().$el)},show:function(a,b){this.actionHandler=a,this.title(b),this.$el.modal("show"),this.fileBrowser.render()},_providerChanged:function(){this.$lastProviderTab&&this.$lastProviderTab.removeClass("active"),this.$lastProviderTab=this.$el.find('[data-provider="'+this.storageInterface.currentProviderId()+'"]').parent(),this.$lastProviderTab.addClass("active")},__title:function(){return"none"},_okClicked:function(){if(this.actionHandler){if(""==this.fileBrowser.fileName())return;var a=this;this.actionHandler(this.storageInterface,this.editorModel,this.fileBrowser.fileName(),function(b,c){c||a.$el.modal("hide")})}},_providerSelected:function(a){this.storageInterface.selectProvider(a.target.dataset.provider)},constructor:function(){a.View.prototype.constructor.apply(this,arguments)}})}),define("strut/storage/model/ActionHandlers",[],function(){return{save:function(a,b,c,d){a.savePresentation(c,b.exportPresentation(c),d)},open:function(a,b,c,d){a.savePresentation(b.fileName(),b.exportPresentation(b.fileName()),function(){a.load(c,function(a,c){c?(console.log(c),console.log(c.stack)):b.importPresentation(a),d(null,c)})})},new_:function(a){a.newPresentation()}}}),define("tantaman/web/widgets/ErrorModal",[],function(){return{show:function(a){console.log(a)}}}),define("strut/storage/view/SaveMenuItem",["libs/backbone","../model/ActionHandlers","tantaman/web/widgets/ErrorModal","lang"],function(a,b,c,d){return a.View.extend({tagName:"li",events:{click:"save"},constructor:function(b,c,d){a.View.prototype.constructor.call(this),this.model=c,this.saveAsModal=b,this.storageInterface=d},save:function(){fileName=this.model.fileName(),null==fileName?this.saveAsModal.show(b.save,d.save_as):b.save(this.storageInterface,this.model,fileName,c.show)},render:function(){return this.$el.html("<a>"+d.save+"</a>"),this}})}),define("tantaman/web/storage/StorageProvidersWrapper",["libs/backbone"],function(a){"use strict";function b(a){this.registry=a,this.registry.on("registered:tantaman.web.StorageProvider",this._providerRegistered,this),this._getProviders(),this._updateCurrentProvider()}return _.extend(b.prototype,a.Events,{_currentProviderId:null,_providerRegistered:function(a){var b=a.service();this.providers[b.id]=b,null==this._currentProviderId&&(this._currentProviderId=b.id),this.trigger("change:providers.push",this.providers,b),this.trigger("change:providers",this.providers,b)},_getProviders:function(){var a=this.registry.get("tantaman.web.StorageProvider"),b={};a.forEach(function(a){var c=a.service();b[c.id]=c,null==this._currentProviderId&&(this._currentProviderId=c.id)},this),this.providers=b},selectProvider:function(a){a!=this._currentProviderId&&(this.currentProvider().bg(),this._currentProviderId=a,this.trigger("change:currentProvider"))},providerNames:function(){var a=[];for(var b in this.providers)a.push({name:this.providers[b].name,id:b});return a},currentProvider:function(){return this.providers[this._currentProviderId]},_updateCurrentProvider:function(){window.sessionMeta.lastProvider&&(this._currentProviderId=window.sessionMeta.lastProvider)}}),b}),define("strut/storage/model/StorageInterface",["tantaman/web/storage/StorageProvidersWrapper"],function(a){"use strict";function b(b){this._providers=new a(b)}return b.prototype={providerNames:function(){return this._providers.providerNames()},providerReady:function(a){return this.currentProvider().ready(a)},activateProvider:function(a,b){this.currentProvider().activate(a,b)},selectProvider:function(a){this._providers.selectProvider(a)},currentProvider:function(){return this._providers.currentProvider()},currentProviderId:function(){return this._providers._currentProviderId},on:function(){return this._providers.on.apply(this._providers,arguments)},store:function(a,b,c){return this.currentProvider().setContents(a,b,c),this},load:function(a,b){return this.currentProvider().getContents(a,b),this},remove:function(a,b){return this.currentProvider().rm(a,b),this},list:function(a,b){return this.currentProvider().ls(a,/.*/,b),this},listPresentations:function(a,b){return this.currentProvider().ls(a,/.*\.strut$/,b),this},savePresentation:function(a,b,c){var d=a.indexOf(".strut");(-1==d||d+".strut".length!=a.length)&&(a+=".strut"),window.sessionMeta.lastPresentation=a,this.store(a,b,c)}},b}),define("tantaman/web/widgets/MenuItem",[],function(){function a(a){this.$el=$("<li><a>"+a.title+" "+(a.hotkey?'<span class="label pull-right">'+a.hotkey+"</span>":"")+"</a></li>"),this.$el.click(function(){a.modal?a.modal.show(a.handler,a.title):a.handler(a.model)})}return a.prototype={render:function(){return this}},a}),define("strut/storage/main",["./view/StorageModal","./view/SaveMenuItem","./model/StorageInterface","./model/ActionHandlers","tantaman/web/widgets/MenuItem","lang"],function(a,b,c,d,e,f){"use strict";var g=null,h=null,i=$("#modals"),j={createMenuItems:function(c){var j=[];return null==h&&(h=new a({editorModel:c,storageInterface:g}),h.render(),i.append(h.$el)),j.push(new e({title:f.new_,handler:d.new_,model:c})),j.push(new e({title:f.open,modal:h,handler:d.open})),j.push(new b(h,c,g)),j.push(new e({title:f.save_as,modal:h,handler:d.save})),j.push({$el:$('<li class="divider"></li>'),render:function(){return this}}),j}};return{initialize:function(a){g=new c(a),a.register({interfaces:"strut.LogoMenuItemProvider"},j),a.register({interfaces:"strut.StorageInterface"},g)}}}),define("framework/ServiceCollection",["common/EventEmitter","lodash"],function(a,b){"use strict";function c(c,e,f){b.extend(this,new a),this._idToItem={},this._lookup=c.normalize(e),this._converter=f||d,this._registry=c,this._register(),this._populateItems()}var d=function(a){return a};c.toServiceConverter=function(a){return a.service()};var e=c.prototype=Object.create(Array.prototype);return e._register=function(){this._registry.on("registered",this._serviceRegistered,this),this._registry.on("deregistered",this._serviceDeregistered,this)},e._serviceDeregistered=function(a){a.matches(this._lookup)&&this._handleRemoval(item,a)},e._handleRemoval=function(a,b){var a=this._idToItem(b.serviceIdentifier());Array.isArray(a)||(a=[a]),a.forEach(function(c){var c=this.indexOf(a);this.splice(c,1),this.emit("deregistered",a,b,c)},this)},e._serviceRegistered=function(a){if(a.matches(this._lookup)){var b=this._converter(a);this._handleAddition(b,a)}},e._populateItems=function(){var a=this._registry.get(this._lookup);a.forEach(function(a){var b=this._converter(a);this._handleAddition(b,a)},this)},e._handleAddition=function(a,b){this._idToItem[b.serviceIdentifier()]=a,Array.isArray(a)?a.forEach(function(c){this.push(c),this.emit("registered",a,b,c)},this):(this.push(a),this.emit("registered",a,b,this.length-1))},e.dispose=function(){this._registry.off(null,null,this)},c}),define("common/collections/LinkedList",[],function(){var a;return a=function(){function a(){this.head=this.tail=null,this.length=0}return a.prototype.push=function(a){var b;return b={prev:null,next:null,value:a},null!=this.tail?(this.tail.next=b,b.prev=this.tail,this.tail=b):this.head=this.tail=b,++this.length,this},a.prototype.pop=function(){var a;if(null==this.tail)throw"List is empty";return a=this.tail.value,this.tail===this.head?this.tail=this.head=null:(this.tail=this.tail.prev,this.tail.next=null),--this.length,a},a.prototype.shift=function(){var a;if(null==this.head)throw"List is empty";return a=this.head.value,this.tail===this.head?this.tail=this.head=null:(this.head=this.head.next,this.head.prev=null),--this.length,a},a.prototype.unshift=function(a){var b;return b={prev:null,next:null,value:a},null!=this.head?(this.head.prev=b,b.next=this.head,this.head=b):this.head=this.tail=b,++this.length,this},a.prototype.first=function(){return this.head.value},a.prototype.last=function(){return this.tail.value},a.prototype.forEach=function(a){var b,c,d;for(b=this.head,c=0,d=[];null!==b;)a(b.value,c++,this),d.push(b=b.next);return d},a}()}),define("tantaman/web/undo_support/Commands",[],function(){var a;return a=function(a,b){this.commands=a,this.name=b},a.prototype={"do":function(){this.commands.forEach(function(a){a.do()})},undo:function(){this.commands.reverse().forEach(function(a){a.undo()})}},{CombinedCommand:a}}),define("tantaman/web/undo_support/CmdList",["common/EventEmitter","common/collections/LinkedList","./Commands"],function(a,b,c){var d=function(){function d(c){this.size=c,this.actions=new b,this.cursor=null,this.recording=!1,this.undoCount=0,_.extend(this,new a)}return d.prototype.clear=function(){this.cursor=null,this.undoCount=null,this.actions=new b},d.prototype.push=function(a){if(!this.recording){var b;return this.actions.length-this.undoCount<this.size?this.undoCount>0?(b={prev:null,next:null,value:a},this.cursor?(b.prev=this.cursor,this.cursor.next.prev=null,this.cursor.next=b,this.actions.length+=1,this.actions.length=this.actions.length-this.undoCount):(this.actions.head=b,this.actions.length=1),this.actions.tail=b,this.undoCount=0,this.cursor=null):(this.actions.push(a),this.cursor=null):(this.actions.shift(),this.actions.push(a)),this.emit("updated"),this}this.recorded.push(a)},d.prototype.pushdo=function(a){if(!this.recording){var b=a.do();return this.push(a),b}this.recorded.push(a)},d.prototype.record=function(a,b){if(this.recording=!0,this.recorded=[],a(),this.recording=!1,this.recorded.length){var d=new c.CombinedCommand(this.recorded,b);return this.push(d),d}},d.prototype.undoName=function(){var a;return this.undoCount<this.actions.length?(a=this.cursor||this.actions.tail,null!=a?a.value.name:""):""},d.prototype.redoName=function(){var a;return this.undoCount>0?(a=null==this.cursor?this.actions.head:this.cursor.next,null!=a?a.value.name:""):""},d.prototype.undo=function(){return this.undoCount<this.actions.length&&(null==this.cursor&&(this.cursor=this.actions.tail),this.cursor.value.undo(),this.cursor=this.cursor.prev,++this.undoCount,this.emit("updated")),this},d.prototype.redo=function(){return this.undoCount>0&&(this.cursor=null==this.cursor?this.actions.head:this.cursor.next,this.cursor.value["do"](),--this.undoCount,this.emit("updated")),this},d}();return d}),define("tantaman/web/undo_support/CmdListFactory",["./CmdList"],function(a){"use strict";var b={};return{create:function(b){return b=b||{},new a(b.size||20)},managedInstance:function(a,c){var d=b[a];return d||(d=this.create(c),b[a]=d),d}}}),define("tantaman/web/widgets/UndoRedoMenuItem",[],function(){"use strict";function a(a){this.$el=$("<li><a>"+a.title+'<span class="label">'+a.hotkey+"</span></a>"+"</li>"),this.options=a,this.$el.click(this._perform.bind(this)),this._sub=a.cmdList.on("updated",this._listUpdated,this)}return a.prototype={render:function(){return this},_listUpdated:function(){var a=this.options.cmdList[this.options.action+"Name"]();if(a){var b=this.$el.find(".label");b.html(a),b.removeClass("dispNone")}else{var b=this.$el.find(".label");b.addClass("dispNone")}},dispose:function(){this._sub.dispose()},_perform:function(){this.options.handler()}},a}),define("strut/logo_button/main",["framework/ServiceCollection","tantaman/web/widgets/MenuItem","tantaman/web/undo_support/CmdListFactory","tantaman/web/widgets/UndoRedoMenuItem"],function(a,b,c,d){"use strict";function e(a){return"undo"==a.meta().action||"redo"==a.meta().action?new d({cmdList:g,action:a.meta().action,handler:a.service(),hotkey:a.meta().hotkey,title:a.meta().title}):new b({title:a.meta().title,handler:a.service(),hotkey:a.meta().hotkey})}var f,g=c.managedInstance("editor"),h={createMenuItems:function(){var a=[];return f.forEach(function(b){a.push(e(b)),"redo"==b.meta().action&&a.push({$el:$('<li class="divider"></li>'),render:function(){return this}})}),a.push({$el:$('<li class="divider"></li>'),render:function(){return this}}),a}};return{initialize:function(b){f=new a(b,"strut.editor.glob.action"),b.register({interfaces:"strut.LogoMenuItemProvider"},h)}}}),define("tantaman/web/widgets/Dropdown",["libs/backbone","css!styles/widgets/widgets.css"],function(a){function b(a,b,c){this.$el=$('<div class="dropdown btn-group">'),this.el=this.$el[0],c&&c.class&&this.$el.addClass(c.class),this._template=b;var d=this;this.$el.on("destroyed",function(){d.dispose()}),this._model=a,a.on&&a.on("change",this._render,this)}return b.prototype={render:function(){var a;return a=this._model.attributes?this._model.attributes:this._model,this.$el.html(this._template(a)),this},dispose:function(){this._model.off&&this._model.off(null,null,this),this.off()}},_.extend(b.prototype,a.Events),b}),define("strut/deck/Utils",[],function(){return{slideSurface:function(a,b){var c;return a&&(c=a.get("surface"),("bg-default"==c||null==c)&&(c=b.slideSurface())),null==c&&(c=b.slideSurface()),c},isImg:function(a){return a&&0==a.indexOf("img:")},getImgUrl:function(a){return"url("+a.substring(4)+")"},slideBackground:function(a,b,c){c=c||{};var d,e=this.slideSurface(a,b);return a?(d=a.get("background"),("bg-default"==d||null==d)&&(d=b.slideBackground()),"bg-transparent"==d&&(d=e)):d=b.slideBackground(),"bg-default"==d&&c.surfaceForDefault&&(d=e),d==e&&c.transparentForSurface&&(d=""),d==b.slideSurface()&&c.transparentForDeckSurface&&(d=""),d},getCurrentBackgrounds:function(a){return a.attr("class").match(/bg-[^ ]+/g)},getCurrentBackground:function(a){var b=this.getCurrentBackgrounds(a);return b?b[0]:void 0},removeCurrentBackground:function(a){var b=this.getCurrentBackgrounds(a);return b&&b.forEach(function(b){a.removeClass(b)}),b},applyBackground:function(a,b,c,d){this.removeCurrentBackground(a);var e=this.slideBackground(b,c,d);0==e.indexOf("img:")?a.css("background-image","url("+e.substring(4)+")"):(a.css("background-image",""),a.addClass(e))}}}),define("libs/imgup",[],function(){var a={};return function(a){"use strict";function b(a){this._xhr=a,a.onload=e.onload.bind(this),a.upload.onabort=a.onabort=a.upload.onerror=a.onerror=a.ontimeout=e.onerror.bind(this),a.upload.onprogress=e.onprogress.bind(this),this._progressBacks=[],this._errorBacks=[],this._thenBacks=[]}function c(a){this.clientId=a}var d={upload:"https://api.imgur.com/3/upload"},e={onload:function(){var a=JSON.parse(this._xhr.responseText);a.success?this._thenBacks.forEach(function(b){b(a)}):e.onerror.call(this,a)},onprogress:function(a){var b=a.loaded/a.total;this._progressBacks.forEach(function(c){c(b,a)})},onerror:function(a){this._errorBacks.forEach(function(b){b(a)})}};b.prototype={cancel:function(){return this._xhr.abort(),this},then:function(a,b){return null!=a&&this._thenBacks.push(a),null!=b&&this._errorBacks.push(b),this},error:function(a){return this._errorBacks.push(a),this},progress:function(a){return this._progressBacks.push(a),this}},c.prototype={upload:function(a){var c=new FormData;c.append("image",a);var e=new XMLHttpRequest;e.open("POST",d.upload),e.setRequestHeader("Authorization","Client-ID "+this.clientId);var f=new b(e);return e.send(c),f}},a.Imgup=c}(a),a.Imgup}),define("tantaman/web/widgets/ItemImportModal",["libs/backbone","libs/imgup"],function(a,b){var c={},d=/[a-z]+:/,e=new b("847de02274cba30"),f={"http:":!0,"http://":!0,"file:":!0,"/":!0,"https://":!0,"https:":!0},g=a.View.extend({className:"itemGrabber modal hide",events:{"click .ok":"okClicked","click div[data-option='browse']":"browseClicked","change input[type='file']":"fileChosen","keyup input[name='itemUrl']":"urlChanged","paste input[name='itemUrl']":"urlChanged",hidden:"hidden"},initialize:function(){this.loadItem=_.debounce(this.loadItem.bind(this),200)},show:function(a){return this.cb=a,this.$el.modal("show")},okClicked:function(){return this.$el.find(".ok").hasClass("disabled")?void 0:(this.cb(this.src),this.$el.modal("hide"))},fileChosen:function(a){var b,c=this;b=a.target.files[0],b.type.match("image.*")&&(this._switchToProgress(),this.item.src="",e.upload(b).progress(function(a){c._updateProgress(a)}).then(function(a){c._switchToThumbnail(),c.$input.val(a.data.link),c.urlChanged({which:-1})},function(){c._updateProgress(0),c._switchToThumbnail(),c.$input.val("Failed to upload image to imgur")}))},browseClicked:function(){return this.$el.find('input[type="file"]').click()},hidden:function(){return null!=this.$input?(this.item.src="",this.$input.val("")):void 0},urlChanged:function(a){return 13===a.which?(this.src=this.$input.val(),this.okClicked()):(this.loadItem(),void 0)},loadItem:function(){var a=this.$input.val();if(!(a in f)){var b=d.exec(a);return(null==b||0!=b.index)&&(a="http://"+a),this.item.src=a,this.src=this.item.src}},_itemLoadError:function(){return this.$el.find(".ok").addClass("disabled"),this.$el.find(".alert").removeClass("dispNone")},_itemLoaded:function(){return this.$el.find(".ok").removeClass("disabled"),this.$el.find(".alert").addClass("dispNone")},_updateProgress:function(a){this.$progressBar.css("width",100*a+"%")},_switchToProgress:function(){this.$thumbnail.addClass("dispNone"),this.$progress.removeClass("dispNone")},_switchToThumbnail:function(){this.$progress.addClass("dispNone"),this.$thumbnail.removeClass("dispNone")},render:function(){var a=this;return this.$el.html(JST["tantaman.web.widgets/ItemImportModal"](this.options)),this.$el.modal(),this.$el.modal("hide"),this.item=this.$el.find(this.options.tag)[0],"video"===this.options.tag&&this.$el.find(".modal-body").prepend("<div class='alert alert-success'>Supports <strong>webm & YouTube</strong>.<br/>Try out: http://www.youtube.com/watch?v=vHUsdkmr-SM</div>"),this.options.ignoreErrors||(this.item.onerror=function(){return a._itemLoadError()},this.item.onload=function(){return a._itemLoaded()}),this.$input=this.$el.find("input[name='itemUrl']"),this.$progress=this.$el.find(".progress"),this.$progressBar=this.$progress.find(".bar"),this.$thumbnail=this.$el.find(".thumbnail"),this.$el},constructor:function(){a.View.prototype.constructor.apply(this,arguments)}});return{get:function(a){var b=c[a.tag];return b||(b=new g(a),b.$el.bind("destroyed",function(){delete c[a.tag]}),c[a.tag]=b,b.render(),$("#modals").append(b.$el)),b},ctor:g}}),define("strut/themes/ColorChooserModal",["libs/backbone"],function(a){return a.View.extend({className:"modal hide",events:{"click .ok":"_apply"},initialize:function(){this._color="#EEE"},show:function(a){this._cb=a,this.$el.modal("show")},hide:function(){this.$el.modal("hide")},_apply:function(){var a="string"==typeof this._color?this._color:this._color.toHexString();this._$colorChooser.spectrum("set",this._color),this._cb(a),this.hide()},render:function(){var a=this;return this.$el.html(JST["strut.themes/ColorChooserModal"]()),this._$body=this.$el.find(".modal-body"),this._$colorChooser=this.$el.find(".color-chooser"),this._$colorChooser.spectrum({color:this._color,showSelectionPalette:!0,localStorageKey:"strut.bgColorChooser",showPalette:!0,showInitial:!0,showInput:!0,palette:[],clickoutFiresChange:!0,flat:!0,move:function(b){a._color=b,a._$body.css("background",b.toHexString())}}),this.$el.modal({show:!1}),this},constructor:function(){a.View.prototype.constructor.apply(this,arguments)}})}),define("strut/themes/BackgroundProvider",["tantaman/web/widgets/Dropdown","strut/deck/Utils","tantaman/web/widgets/ItemImportModal","./ColorChooserModal","lang"],function(a,b,c,d,e){function f(b){var c=b.backgrounds,d=b.editorModel,e=b.selector,f=b.attr;this._view=new a(c,b.template,{"class":"iconBtns group-dropdown"}),this._editorModel=d,this._selector=e,this._attr=f,this._previewBackground=this._previewBackground.bind(this),this._restoreBackground=this._restoreBackground.bind(this),this._setBackground=this._setBackground.bind(this),this._view.$el.on("mouseover",".thumbnail",this._previewBackground),this._view.$el.on("mouseout",".thumbnail",this._restoreBackground),this._view.$el.on("click",".thumbnail",this._setBackground),this._setBackgroundImage=this._setBackgroundImage.bind(this)}var g=c.get({tag:"img",name:e.image,title:e.insert_image,icon:"icon-picture",browsable:!0}),h=new d;return h.render(),$("#modals").append(h.$el),f.prototype={view:function(){return this._view},_previewBackground:function(a){var c=$(this._selector);if(0!=c.length){var d=a.currentTarget.dataset["class"];null!=d&&"bg-img"!=d&&"bg-custom"!=d&&("bg-default"==d&&"Background"==this._attr&&(d=$(a.currentTarget).parent().parent().is(".allSlides")?this._editorModel.deck().slideSurface():b.slideBackground(null,this._editorModel.deck(),{transparentForSurface:!0,surfaceForDefault:!0})),this._swapBg(c,d))}},_setBackground:function(a){var b=a.currentTarget.dataset["class"],c=$(a.currentTarget).parent().parent().is(".allSlides");if("bg-img"==b){var d=this;return g.show(function(a){d._setBackgroundImage(c,a)}),void 0}if("bg-custom"==b){var d=this;return h.show(function(a){d._setCustomBgColor(c,a)}),void 0}this._setBgClass(c,b)},_setCustomBgColor:function(a,b){var c=this._editorModel.addCustomBgClassFor(b).klass;this._setBgClass(a,c)},_setBgClass:function(a,b){if(null!=b){var c=this._attr.substring(0,1).toLowerCase()+this._attr.substring(1),d=this._pickObj(a);""==b&&(b=void 0),d.set(c,b)}},_pickObj:function(a){return a?this._editorModel.deck():this._editorModel.activeSlide()},_setBackgroundImage:function(a,b){var c=this._pickObj(a);"Background"==this._attr?c.set("background","img:"+b):c.set("surface","img:"+b)},_restoreBackground:function(){var a;"Background"==this._attr&&(a=b.slideBackground(this._editorModel.activeSlide(),this._editorModel.deck(),{transparentForSurface:!0,surfaceForDefault:!0})),null==a&&(a="slide-editor"!=this._editorModel.get("modeId")?b.slideSurface(null,this._editorModel.deck()):b.slideSurface(this._editorModel.activeSlide(),this._editorModel.deck()));var c=$(this._selector);0!=c.length&&(b.isImg(a)?this._removeLastBg(c):this._swapBg(c,a))},_removeLastBg:function(a){this._lastBg||(this._lastBg=b.getCurrentBackground(a)),this._lastBg&&a.removeClass(this._lastBg)},_swapBg:function(a,b){this._removeLastBg(a),this._lastBg=b,a.addClass(b)},dispose:function(){this._view.dispose()}},f}),define("strut/themes/AvailableBackgrounds",["css!styles/strut.themes/backgroundClasses.css"],function(){return{title:"background",backgrounds:[{klass:"bg-solid-black",description:"Black"},{klass:"bg-solid-light",description:"Light"},{klass:"bg-solid-smoke",description:"Smoke"},{klass:"bg-solid-orange",description:"Orange"},{klass:"bg-solid-yellow",description:"Yellow"},{klass:"bg-solid-grass",description:"Grass"},{klass:"bg-solid-darkgreen",description:"Dark Green"},{klass:"bg-solid-sky",description:"Sky"},{klass:"bg-solid-lavender",description:"Lavender"},{klass:"bg-solid-purple",description:"Purple"},{klass:"bg-solid-salmon",description:"Salmon"}]}}),define("strut/themes/AvailableSurfaces",["css!styles/strut.themes/surfaceClasses.css"],function(){return{title:"surface",backgrounds:[{klass:"bg-surf-grad-black"},{klass:"bg-surf-grad-light"},{klass:"bg-surf-grad-smoke"},{klass:"bg-surf-grad-orange"},{klass:"bg-surf-grad-yellow"},{klass:"bg-surf-grad-grass"},{klass:"bg-surf-grad-darkgreen"},{klass:"bg-surf-grad-sky"},{klass:"bg-surf-grad-lavender"},{klass:"bg-surf-grad-purple"},{klass:"bg-surf-grad-salmon"}]}}),console.log("Loaded mirror"),window.CodeMirror=function(){"use strict";function a(c,d){if(!(this instanceof a))return new a(c,d);this.options=d=d||{};for(var e in cf)!d.hasOwnProperty(e)&&cf.hasOwnProperty(e)&&(d[e]=cf[e]);m(d);var f="string"==typeof d.value?0:d.value.first,g=this.display=b(c,f);g.wrapper.CodeMirror=this,j(this),d.autofocus&&!Ke&&nb(this),this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,draggingText:!1,highlight:new Sd},h(this),d.lineWrapping&&(this.display.wrapper.className+=" CodeMirror-wrap");var i=d.value;"string"==typeof i&&(i=new rf(d.value,d.mode)),fb(this,jd)(this,i),xe&&setTimeout(_d(mb,this,!0),20),pb(this);var k;try{k=document.activeElement==g.input}catch(l){}k||d.autofocus&&!Ke?setTimeout(_d(Fb,this),20):Gb(this),fb(this,function(){for(var a in bf)bf.propertyIsEnumerable(a)&&bf[a](this,d[a],df);for(var b=0;b<hf.length;++b)hf[b](this)})()}function b(a,b){var c={},d=c.input=ce("textarea",null,null,"position: absolute; padding: 0; width: 1px; height: 1em; outline: none; font-size: 4px;");return Ae?d.style.width="1000px":d.setAttribute("wrap","off"),Je&&(d.style.border="1px solid black"),d.setAttribute("autocorrect","off"),d.setAttribute("autocapitalize","off"),d.setAttribute("spellcheck","false"),c.inputDiv=ce("div",[d],null,"overflow: hidden; position: relative; width: 3px; height: 0px;"),c.scrollbarH=ce("div",[ce("div",null,null,"height: 1px")],"CodeMirror-hscrollbar"),c.scrollbarV=ce("div",[ce("div",null,null,"width: 1px")],"CodeMirror-vscrollbar"),c.scrollbarFiller=ce("div",null,"CodeMirror-scrollbar-filler"),c.gutterFiller=ce("div",null,"CodeMirror-gutter-filler"),c.lineDiv=ce("div",null,"CodeMirror-code"),c.selectionDiv=ce("div",null,null,"position: relative; z-index: 1"),c.cursor=ce("div"," ","CodeMirror-cursor"),c.otherCursor=ce("div"," ","CodeMirror-cursor CodeMirror-secondarycursor"),c.measure=ce("div",null,"CodeMirror-measure"),c.lineSpace=ce("div",[c.measure,c.selectionDiv,c.lineDiv,c.cursor,c.otherCursor],null,"position: relative; outline: none"),c.mover=ce("div",[ce("div",[c.lineSpace],"CodeMirror-lines")],null,"position: relative"),c.sizer=ce("div",[c.mover],"CodeMirror-sizer"),c.heightForcer=ce("div",null,null,"position: absolute; height: "+wf+"px; width: 1px;"),c.gutters=ce("div",null,"CodeMirror-gutters"),c.lineGutter=null,c.scroller=ce("div",[c.sizer,c.heightForcer,c.gutters],"CodeMirror-scroll"),c.scroller.setAttribute("tabIndex","-1"),c.wrapper=ce("div",[c.inputDiv,c.scrollbarH,c.scrollbarV,c.scrollbarFiller,c.gutterFiller,c.scroller],"CodeMirror"),ye&&(c.gutters.style.zIndex=-1,c.scroller.style.paddingRight=0),a.appendChild?a.appendChild(c.wrapper):a(c.wrapper),Je&&(d.style.width="0px"),Ae||(c.scroller.draggable=!0),Fe?(c.inputDiv.style.height="1px",c.inputDiv.style.position="absolute"):ye&&(c.scrollbarH.style.minWidth=c.scrollbarV.style.minWidth="18px"),c.viewOffset=c.lastSizeC=0,c.showingFrom=c.showingTo=b,c.lineNumWidth=c.lineNumInnerWidth=c.lineNumChars=null,c.prevInput="",c.alignWidgets=!1,c.pollingFast=!1,c.poll=new Sd,c.cachedCharWidth=c.cachedTextHeight=null,c.measureLineCache=[],c.measureLineCachePos=0,c.inaccurateSelection=!1,c.maxLine=null,c.maxLineLength=0,c.maxLineChanged=!1,c.wheelDX=c.wheelDY=c.wheelStartX=c.wheelStartY=null,c}function c(b){b.doc.mode=a.getMode(b.options,b.doc.modeOption),b.doc.iter(function(a){a.stateAfter&&(a.stateAfter=null),a.styles&&(a.styles=null)}),b.doc.frontier=b.doc.first,G(b,100),b.state.modeGen++,b.curOp&&ib(b)}function d(a){a.options.lineWrapping?(a.display.wrapper.className+=" CodeMirror-wrap",a.display.sizer.style.minWidth=""):(a.display.wrapper.className=a.display.wrapper.className.replace(" CodeMirror-wrap",""),l(a)),f(a),ib(a),T(a),setTimeout(function(){n(a)},100)}function e(a){var b=bb(a.display),c=a.options.lineWrapping,d=c&&Math.max(5,a.display.scroller.clientWidth/cb(a.display)-3);return function(e){return Nc(a.doc,e)?0:c?(Math.ceil(e.text.length/d)||1)*b:b}}function f(a){var b=a.doc,c=e(a);b.iter(function(a){var b=c(a);b!=a.height&&nd(a,b)})}function g(a){var b=lf[a.options.keyMap],c=b.style;a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-keymap-\S+/g,"")+(c?" cm-keymap-"+c:""),a.state.disableInput=b.disableInput}function h(a){a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+a.options.theme.replace(/(^|\s)\s*/g," cm-s-"),T(a)}function i(a){j(a),ib(a),setTimeout(function(){p(a)},20)}function j(a){var b=a.display.gutters,c=a.options.gutters;de(b);for(var d=0;d<c.length;++d){var e=c[d],f=b.appendChild(ce("div",null,"CodeMirror-gutter "+e));"CodeMirror-linenumbers"==e&&(a.display.lineGutter=f,f.style.width=(a.display.lineNumWidth||1)+"px")}b.style.display=d?"":"none"}function k(a,b){if(0==b.height)return 0;for(var c,d=b.text.length,e=b;c=Kc(e);){var f=c.find();e=kd(a,f.from.line),d+=f.from.ch-f.to.ch}for(e=b;c=Lc(e);){var f=c.find();d-=e.text.length-f.from.ch,e=kd(a,f.to.line),d+=e.text.length-f.to.ch}return d}function l(a){var b=a.display,c=a.doc;b.maxLine=kd(c,c.first),b.maxLineLength=k(c,b.maxLine),b.maxLineChanged=!0,c.iter(function(a){var d=k(c,a);d>b.maxLineLength&&(b.maxLineLength=d,b.maxLine=a)})}function m(a){for(var b=!1,c=0;c<a.gutters.length;++c)"CodeMirror-linenumbers"==a.gutters[c]&&(a.lineNumbers?b=!0:a.gutters.splice(c--,1));!b&&a.lineNumbers&&a.gutters.push("CodeMirror-linenumbers")}function n(a){var b=a.display,c=a.doc.height,d=c+L(b);b.sizer.style.minHeight=b.heightForcer.style.top=d+"px",b.gutters.style.height=Math.max(d,b.scroller.clientHeight-wf)+"px";var e=Math.max(d,b.scroller.scrollHeight),f=b.scroller.scrollWidth>b.scroller.clientWidth+1,g=e>b.scroller.clientHeight+1;g?(b.scrollbarV.style.display="block",b.scrollbarV.style.bottom=f?ie(b.measure)+"px":"0",b.scrollbarV.firstChild.style.height=e-b.scroller.clientHeight+b.scrollbarV.clientHeight+"px"):(b.scrollbarV.style.display="",b.scrollbarV.firstChild.style.height="0"),f?(b.scrollbarH.style.display="block",b.scrollbarH.style.right=g?ie(b.measure)+"px":"0",b.scrollbarH.firstChild.style.width=b.scroller.scrollWidth-b.scroller.clientWidth+b.scrollbarH.clientWidth+"px"):(b.scrollbarH.style.display="",b.scrollbarH.firstChild.style.width="0"),f&&g?(b.scrollbarFiller.style.display="block",b.scrollbarFiller.style.height=b.scrollbarFiller.style.width=ie(b.measure)+"px"):b.scrollbarFiller.style.display="",f&&a.options.coverGutterNextToScrollbar&&a.options.fixedGutter?(b.gutterFiller.style.display="block",b.gutterFiller.style.height=ie(b.measure)+"px",b.gutterFiller.style.width=b.gutters.offsetWidth+"px"):b.gutterFiller.style.display="",Ge&&0===ie(b.measure)&&(b.scrollbarV.style.minWidth=b.scrollbarH.style.minHeight=He?"18px":"12px")}function o(a,b,c){var d=a.scroller.scrollTop,e=a.wrapper.clientHeight;"number"==typeof c?d=c:c&&(d=c.top,e=c.bottom-c.top),d=Math.floor(d-K(a));var f=Math.ceil(d+e);return{from:pd(b,d),to:pd(b,f)}}function p(a){var b=a.display;if(b.alignWidgets||b.gutters.firstChild&&a.options.fixedGutter){for(var c=s(b)-b.scroller.scrollLeft+a.doc.scrollLeft,d=b.gutters.offsetWidth,e=c+"px",f=b.lineDiv.firstChild;f;f=f.nextSibling)if(f.alignable)for(var g=0,h=f.alignable;g<h.length;++g)h[g].style.left=e;a.options.fixedGutter&&(b.gutters.style.left=c+d+"px")
					}
				}
					function q(a) {
					if (!a.options.lineNumbers)
						return !1;
					var b = a.doc,
					c = r(a.options, b.first + b.size - 1),
					d = a.display;
					if (c.length != d.lineNumChars) {
						var e = d.measure.appendChild(ce("div", [ce("div", c)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
						f = e.firstChild.offsetWidth,
						g = e.offsetWidth - f;
						return d.lineGutter.style.width = "",
						d.lineNumInnerWidth = Math.max(f, d.lineGutter.offsetWidth - g),
						d.lineNumWidth = d.lineNumInnerWidth + g,
						d.lineNumChars = d.lineNumInnerWidth ? c.length : -1,
						d.lineGutter.style.width = d.lineNumWidth + "px",
						!0
					}
					return !1
				}
					function r(a, b) {
					return String(a.lineNumberFormatter(b + a.firstLineNumber))
				}
					function s(a) {
					return ge(a.scroller).left - ge(a.sizer).left
				}
					function t(a, b, c, d) {
					for (var e, f = a.display.showingFrom, g = a.display.showingTo, h = o(a.display, a.doc, c); u(a, b, h, d) && (d = !1, e = !0, C(a), n(a), c && (c = Math.min(a.display.scroller.scrollHeight - a.display.scroller.clientHeight, "number" == typeof c ? c : c.top)), h = o(a.display, a.doc, c), !(h.from >= a.display.showingFrom && h.to <= a.display.showingTo)); )
						b = [];
					return e && (Nd(a, "update", a), (a.display.showingFrom != f || a.display.showingTo != g) && Nd(a, "viewportChange", a, a.display.showingFrom, a.display.showingTo)),
					e
				}
					function u(a, b, c, d) {
					var e = a.display,
					f = a.doc;
					if (!e.wrapper.clientWidth)
						return e.showingFrom = e.showingTo = f.first, e.viewOffset = 0, void 0;
					if (!(!d && 0 == b.length && c.from > e.showingFrom && c.to < e.showingTo)) {
						q(a) && (b = [{
									from : f.first,
									to : f.first + f.size
								}
							]);
						var g = e.sizer.style.marginLeft = e.gutters.offsetWidth + "px";
						e.scrollbarH.style.left = a.options.fixedGutter ? g : "0";
						var h = 1 / 0;
						if (a.options.lineNumbers)
							for (var i = 0; i < b.length; ++i)
								b[i].diff && b[i].from < h && (h = b[i].from);
						var j = f.first + f.size,
						k = Math.max(c.from - a.options.viewportMargin, f.first),
						l = Math.min(j, c.to + a.options.viewportMargin);
						if (e.showingFrom < k && k - e.showingFrom < 20 && (k = Math.max(f.first, e.showingFrom)), e.showingTo > l && e.showingTo - l < 20 && (l = Math.min(j, e.showingTo)), Ue)
							for (k = od(Mc(f, kd(f, k))); j > l && Nc(f, kd(f, l)); )
								++l;
						var m = [{
								from : Math.max(e.showingFrom, f.first),
								to : Math.min(e.showingTo, j)
							}
						];
						if (m = m[0].from >= m[0].to ? [] : x(m, b), Ue)
							for (var i = 0; i < m.length; ++i)
								for (var n, o = m[i]; n = Lc(kd(f, o.to - 1)); ) {
									var p = n.find().from.line;
									if (!(p > o.from)) {
										m.splice(i--, 1);
										break
									}
									o.to = p
								}
						for (var r = 0, i = 0; i < m.length; ++i) {
							var o = m[i];
							o.from < k && (o.from = k),
							o.to > l && (o.to = l),
							o.from >= o.to ? m.splice(i--, 1) : r += o.to - o.from
						}
						if (!d && r == l - k && k == e.showingFrom && l == e.showingTo)
							return w(a), void 0;
						m.sort(function (a, b) {
							return a.from - b.from
						});
						try {
							var s = document.activeElement
						} catch (t) {}

						.7 * (l - k) > r && (e.lineDiv.style.display = "none"),
						z(a, k, l, m, h),
						e.lineDiv.style.display = "",
						s && document.activeElement != s && s.offsetHeight && s.focus();
						var u = k != e.showingFrom || l != e.showingTo || e.lastSizeC != e.wrapper.clientHeight;
						return u && (e.lastSizeC = e.wrapper.clientHeight, G(a, 400)),
						e.showingFrom = k,
						e.showingTo = l,
						v(a),
						w(a),
						!0
					}
				}
					function v(a) {
					for (var b, c = a.display, d = c.lineDiv.offsetTop, e = c.lineDiv.firstChild; e; e = e.nextSibling)
						if (e.lineObj) {
							if (ye) {
								var f = e.offsetTop + e.offsetHeight;
								b = f - d,
								d = f
							} else {
								var g = ge(e);
								b = g.bottom - g.top
							}
							var h = e.lineObj.height - b;
							if (2 > b && (b = bb(c)), h > .001 ||  - .001 > h) {
								nd(e.lineObj, b);
								var i = e.lineObj.widgets;
								if (i)
									for (var j = 0; j < i.length; ++j)
										i[j].height = i[j].node.offsetHeight
							}
						}
				}
					function w(a) {
					var b = a.display.viewOffset = qd(a, kd(a.doc, a.display.showingFrom));
					a.display.mover.style.top = b + "px"
				}
					function x(a, b) {
					for (var c = 0, d = b.length || 0; d > c; ++c) {
						for (var e = b[c], f = [], g = e.diff || 0, h = 0, i = a.length; i > h; ++h) {
							var j = a[h];
							e.to <= j.from && e.diff ? f.push({
								from : j.from + g,
								to : j.to + g
							}) : e.to <= j.from || e.from >= j.to ? f.push(j) : (e.from > j.from && f.push({
									from : j.from,
									to : e.from
								}), e.to < j.to && f.push({
									from : e.to + g,
									to : j.to + g
								}))
						}
						a = f
					}
					return a
				}
					function y(a) {
					for (var b = a.display, c = {}, d = {}, e = b.gutters.firstChild, f = 0; e; e = e.nextSibling, ++f)
						c[a.options.gutters[f]] = e.offsetLeft, d[a.options.gutters[f]] = e.offsetWidth;
					return {
						fixedPos : s(b),
						gutterTotalWidth : b.gutters.offsetWidth,
						gutterLeft : c,
						gutterWidth : d,
						wrapperWidth : b.wrapper.clientWidth
					}
				}
					function z(a, b, c, d, e) {
					function f(b) {
						var c = b.nextSibling;
						return Ae && Le && a.display.currentWheelTarget == b ? (b.style.display = "none", b.lineObj = null) : b.parentNode.removeChild(b),
						c
					}
					var g = y(a),
					h = a.display,
					i = a.options.lineNumbers;
					d.length || Ae && a.display.currentWheelTarget || de(h.lineDiv);
					var j = h.lineDiv,
					k = j.firstChild,
					l = d.shift(),
					m = b;
					for (a.doc.iter(b, c, function (b) {
							if (l && l.to == m && (l = d.shift()), Nc(a.doc, b)) {
								if (0 != b.height && nd(b, 0), b.widgets && k && k.previousSibling)
									for (var c = 0; c < b.widgets.length; ++c) {
										var h = b.widgets[c];
										if (h.showIfHidden) {
											var n = k.previousSibling;
											if (/pre/i.test(n.nodeName)) {
												var o = ce("div", null, null, "position: relative");
												n.parentNode.replaceChild(o, n),
												o.appendChild(n),
												n = o
											}
											var p = n.appendChild(ce("div", [h.node], "CodeMirror-linewidget"));
											h.handleMouseEvents || (p.ignoreEvents = !0),
											B(h, p, n, g)
										}
									}
							} else if (l && l.from <= m && l.to > m) {
								for (; k.lineObj != b; )
									k = f(k);
								i && m >= e && k.lineNumber && fe(k.lineNumber, r(a.options, m)),
								k = k.nextSibling
							} else {
								if (b.widgets)
									for (var q, s = 0, t = k; t && 20 > s; ++s, t = t.nextSibling)
										if (t.lineObj == b && /div/i.test(t.nodeName)) {
											q = t;
											break
										}
								var u = A(a, b, m, g, q);
								if (u != q)
									j.insertBefore(u, k);
									else {
										for (; k != q; )
											k = f(k);
										k = k.nextSibling
									}
									u.lineObj = b
								}
								++m
							}); k; )k = f(k)
				}
					function A(a, b, c, d, e) {
					var f,
					g = _c(a, b),
					h = b.gutterMarkers,
					i = a.display;
					if (!(a.options.lineNumbers || h || b.bgClass || b.wrapClass || b.widgets))
						return g;
					if (e) {
						e.alignable = null;
						for (var j, k = !0, l = 0, m = null, n = e.firstChild; n; n = j)
							if (j = n.nextSibling, /\bCodeMirror-linewidget\b/.test(n.className)) {
								for (var o = 0; o < b.widgets.length; ++o) {
									var p = b.widgets[o];
									if (p.node == n.firstChild) {
										p.above || m || (m = n),
										B(p, n, e, d),
										++l;
										break
									}
								}
								if (o == b.widgets.length) {
									k = !1;
									break
								}
							} else
								e.removeChild(n);
						e.insertBefore(g, m),
						k && l == b.widgets.length && (f = e, e.className = b.wrapClass || "")
					}
					if (f || (f = ce("div", null, b.wrapClass, "position: relative"), f.appendChild(g)), b.bgClass && f.insertBefore(ce("div", null, b.bgClass + " CodeMirror-linebackground"), f.firstChild), a.options.lineNumbers || h) {
						var q = f.insertBefore(ce("div", null, null, "position: absolute; left: " + (a.options.fixedGutter ? d.fixedPos : -d.gutterTotalWidth) + "px"), f.firstChild);
						if (a.options.fixedGutter && (f.alignable || (f.alignable = [])).push(q), !a.options.lineNumbers || h && h["CodeMirror-linenumbers"] || (f.lineNumber = q.appendChild(ce("div", r(a.options, c), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + d.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + i.lineNumInnerWidth + "px"))), h)
							for (var s = 0; s < a.options.gutters.length; ++s) {
								var t = a.options.gutters[s],
								u = h.hasOwnProperty(t) && h[t];
								u && q.appendChild(ce("div", [u], "CodeMirror-gutter-elt", "left: " + d.gutterLeft[t] + "px; width: " + d.gutterWidth[t] + "px"))
							}
					}
					if (ye && (f.style.zIndex = 2), b.widgets && f != e)
						for (var o = 0, v = b.widgets; o < v.length; ++o) {
							var p = v[o],
							w = ce("div", [p.node], "CodeMirror-linewidget");
							p.handleMouseEvents || (w.ignoreEvents = !0),
							B(p, w, f, d),
							p.above ? f.insertBefore(w, a.options.lineNumbers && 0 != b.height ? q : g) : f.appendChild(w),
							Nd(p, "redraw")
						}
					return f
				}
					function B(a, b, c, d) {
					if (a.noHScroll) {
						(c.alignable || (c.alignable = [])).push(b);
						var e = d.wrapperWidth;
						b.style.left = d.fixedPos + "px",
						a.coverGutter || (e -= d.gutterTotalWidth, b.style.paddingLeft = d.gutterTotalWidth + "px"),
						b.style.width = e + "px"
					}
					a.coverGutter && (b.style.zIndex = 5, b.style.position = "relative", a.noHScroll || (b.style.marginLeft = -d.gutterTotalWidth + "px"))
				}
					function C(a) {
					var b = a.display,
					c = Tb(a.doc.sel.from, a.doc.sel.to);
					if (c || a.options.showCursorWhenSelecting ? D(a) : b.cursor.style.display = b.otherCursor.style.display = "none", c ? b.selectionDiv.style.display = "none" : E(a), a.options.moveInputWithCursor) {
						var d = Z(a, a.doc.sel.head, "div"),
						e = ge(b.wrapper),
						f = ge(b.lineDiv);
						b.inputDiv.style.top = Math.max(0, Math.min(b.wrapper.clientHeight - 10, d.top + f.top - e.top)) + "px",
						b.inputDiv.style.left = Math.max(0, Math.min(b.wrapper.clientWidth - 10, d.left + f.left - e.left)) + "px"
					}
				}
					function D(a) {
					var b = a.display,
					c = Z(a, a.doc.sel.head, "div");
					b.cursor.style.left = c.left + "px",
					b.cursor.style.top = c.top + "px",
					b.cursor.style.height = Math.max(0, c.bottom - c.top) * a.options.cursorHeight + "px",
					b.cursor.style.display = "",
					c.other ? (b.otherCursor.style.display = "", b.otherCursor.style.left = c.other.left + "px", b.otherCursor.style.top = c.other.top + "px", b.otherCursor.style.height = .85 * (c.other.bottom - c.other.top) + "px") : b.otherCursor.style.display = "none"
				}
					function E(a) {
					function b(a, b, c, d) {
						0 > b && (b = 0),
						g.appendChild(ce("div", null, "CodeMirror-selected", "position: absolute; left: " + a + "px; top: " + b + "px; width: " + (null == c ? h - a : c) + "px; height: " + (d - b) + "px"))
					}
					function c(c, d, f) {
						function g(b, d) {
							return Y(a, Sb(c, b), "div", l, d)
						}
						var j,
						k,
						l = kd(e, c),
						m = l.text.length;
						return ke(rd(l), d || 0, null == f ? m : f, function (a, c, e) {
							var l,
							n,
							o,
							p = g(a, "left");
							if (a == c)
								l = p, n = o = p.left;
							else {
								if (l = g(c - 1, "right"), "rtl" == e) {
									var q = p;
									p = l,
									l = q
								}
								n = p.left,
								o = l.right
							}
							null == d && 0 == a && (n = i),
							l.top - p.top > 3 && (b(n, p.top, null, p.bottom), n = i, p.bottom < l.top && b(n, p.bottom, null, l.top)),
							null == f && c == m && (o = h),
							(!j || p.top < j.top || p.top == j.top && p.left < j.left) && (j = p),
							(!k || l.bottom > k.bottom || l.bottom == k.bottom && l.right > k.right) && (k = l),
							i + 1 > n && (n = i),
							b(n, l.top, o - n, l.bottom)
						}), {
							start : j,
							end : k
						}
					}
					var d = a.display,
					e = a.doc,
					f = a.doc.sel,
					g = document.createDocumentFragment(),
					h = d.lineSpace.offsetWidth,
					i = M(a.display);
					if (f.from.line == f.to.line)
						c(f.from.line, f.from.ch, f.to.ch);
					else {
						var j = kd(e, f.from.line),
						k = kd(e, f.to.line),
						l = Mc(e, j) == Mc(e, k),
						m = c(f.from.line, f.from.ch, l ? j.text.length : null).end,
						n = c(f.to.line, l ? 0 : null, f.to.ch).start;
						l && (m.top < n.top - 2 ? (b(m.right, m.top, null, m.bottom), b(i, n.top, n.left, n.bottom)) : b(m.right, m.top, n.left - m.right, m.bottom)),
						m.bottom < n.top && b(i, m.bottom, null, n.top)
					}
					ee(d.selectionDiv, g),
					d.selectionDiv.style.display = ""
				}
					function F(a) {
					if (a.state.focused) {
						var b = a.display;
						clearInterval(b.blinker);
						var c = !0;
						b.cursor.style.visibility = b.otherCursor.style.visibility = "",
						a.options.cursorBlinkRate > 0 && (b.blinker = setInterval(function () {
									b.cursor.style.visibility = b.otherCursor.style.visibility = (c = !c) ? "" : "hidden"
								}, a.options.cursorBlinkRate))
					}
				}
					function G(a, b) {
					a.doc.mode.startState && a.doc.frontier < a.display.showingTo && a.state.highlight.set(b, _d(H, a))
				}
					function H(a) {
					var b = a.doc;
					if (b.frontier < b.first && (b.frontier = b.first), !(b.frontier >= a.display.showingTo)) {
						var c,
						d = +new Date + a.options.workTime,
						e = qc(b.mode, J(a, b.frontier)),
						f = [];
						b.iter(b.frontier, Math.min(b.first + b.size, a.display.showingTo + 500), function (g) {
							if (b.frontier >= a.display.showingFrom) {
								var h = g.styles;
								g.styles = Xc(a, g, e);
								for (var i = !h || h.length != g.styles.length, j = 0; !i && j < h.length; ++j)
									i = h[j] != g.styles[j];
								i && (c && c.end == b.frontier ? c.end++ : f.push(c = {
											start : b.frontier,
											end : b.frontier + 1
										})),
								g.stateAfter = qc(b.mode, e)
							} else
								Zc(a, g, e), g.stateAfter = 0 == b.frontier % 5 ? qc(b.mode, e) : null;
							return ++b.frontier,
							+new Date > d ? (G(a, a.options.workDelay), !0) : void 0
						}),
						f.length && fb(a, function () {
							for (var a = 0; a < f.length; ++a)
								ib(this, f[a].start, f[a].end)
						})()
					}
				}
					function I(a, b, c) {
					for (var d, e, f = a.doc, g = a.doc.mode.innerMode ? 1e3 : 100, h = b, i = b - g; h > i; --h) {
						if (h <= f.first)
							return f.first;
						var j = kd(f, h - 1);
						if (j.stateAfter && (!c || h <= f.frontier))
							return h;
						var k = Td(j.text, null, a.options.tabSize);
						(null == e || d > k) && (e = h - 1, d = k)
					}
					return e
				}
					function J(a, b, c) {
					var d = a.doc,
					e = a.display;
					if (!d.mode.startState)
						return !0;
					var f = I(a, b, c),
					g = f > d.first && kd(d, f - 1).stateAfter;
					return g = g ? qc(d.mode, g) : rc(d.mode),
					d.iter(f, b, function (c) {
						Zc(a, c, g);
						var h = f == b - 1 || 0 == f % 5 || f >= e.showingFrom && f < e.showingTo;
						c.stateAfter = h ? qc(d.mode, g) : null,
						++f
					}),
					g
				}
					function K(a) {
					return a.lineSpace.offsetTop
				}
					function L(a) {
					return a.mover.offsetHeight - a.lineSpace.offsetHeight
				}
					function M(a) {
					var b = ee(a.measure, ce("pre", null, null, "text-align: left")).appendChild(ce("span", "x"));
					return b.offsetLeft
				}
					function N(a, b, c, d, e) {
					var f = -1;
					d = d || Q(a, b);
					for (var g = c; ; g += f) {
						var h = d[g];
						if (h)
							break;
						0 > f && 0 == g && (f = 1)
					}
					return e = g > c ? "left" : c > g ? "right" : e,
					"left" == e && h.leftSide ? h = h.leftSide : "right" == e && h.rightSide && (h = h.rightSide), {
						left : c > g ? h.right : h.left,
						right : g > c ? h.left : h.right,
						top : h.top,
						bottom : h.bottom
					}
				}
					function O(a, b) {
					for (var c = a.display.measureLineCache, d = 0; d < c.length; ++d) {
						var e = c[d];
						if (e.text == b.text && e.markedSpans == b.markedSpans && a.display.scroller.clientWidth == e.width && e.classes == b.textClass + "|" + b.bgClass + "|" + b.wrapClass)
							return e
					}
				}
					function P(a, b) {
					var c = O(a, b);
					c && (c.text = c.measure = c.markedSpans = null)
				}
					function Q(a, b) {
					var c = O(a, b);
					if (c)
						return c.measure;
					var d = R(a, b),
					e = a.display.measureLineCache,
					f = {
						text : b.text,
						width : a.display.scroller.clientWidth,
						markedSpans : b.markedSpans,
						measure : d,
						classes : b.textClass + "|" + b.bgClass + "|" + b.wrapClass
					};
					return 16 == e.length ? e[++a.display.measureLineCachePos % 16] = f : e.push(f),
					d
				}
					function R(a, b) {
					function c(a) {
						var b = a.top - o.top,
						c = a.bottom - o.top;
						c > r && (c = r),
						0 > b && (b = 0);
						for (var d = p.length - 2; d >= 0; d -= 2) {
							var e = p[d],
							f = p[d + 1];
							if (!(e > c || b > f) && (b >= e && f >= c || e >= b && c >= f || Math.min(c, f) - Math.max(b, e) >= c - b >> 1)) {
								p[d] = Math.min(b, e),
								p[d + 1] = Math.max(c, f);
								break
							}
						}
						return 0 > d && (d = p.length, p.push(b, c)), {
							left : a.left - o.left,
							right : a.right - o.left,
							top : d,
							bottom : null
						}
					}
					function d(a) {
						a.bottom = p[a.top + 1],
						a.top = p[a.top]
					}
					var e = a.display,
					f = $d(b.text.length),
					g = _c(a, b, f, !0);
					if (xe && !ye && !a.options.lineWrapping && g.childNodes.length > 100) {
						for (var h = document.createDocumentFragment(), i = 10, j = g.childNodes.length, k = 0, l = Math.ceil(j / i); l > k; ++k) {
							for (var m = ce("div", null, null, "display: inline-block"), n = 0; i > n && j; ++n)
								m.appendChild(g.firstChild), --j;
							h.appendChild(m)
						}
						g.appendChild(h)
					}
					ee(e.measure, g);
					var o = ge(e.lineDiv),
					p = [],
					q = $d(b.text.length),
					r = g.offsetHeight;
					ze && e.measure.first != g && ee(e.measure, g);
					for (var s, k = 0; k < f.length; ++k)
						if (s = f[k]) {
							var t = s,
							u = null;
							if (/\bCodeMirror-widget\b/.test(s.className) && s.getClientRects) {
								1 == s.firstChild.nodeType && (t = s.firstChild);
								var v = t.getClientRects();
								v.length > 1 && (u = q[k] = c(v[0]), u.rightSide = c(v[v.length - 1]))
							}
							u || (u = q[k] = c(ge(t))),
							s.measureRight && (u.right = ge(s.measureRight).left),
							s.leftSide && (u.leftSide = c(ge(s.leftSide)))
						}
					de(a.display.measure);
					for (var s, k = 0; k < q.length; ++k)
						(s = q[k]) && (d(s), s.leftSide && d(s.leftSide), s.rightSide && d(s.rightSide));
					return q
				}
					function S(a, b) {
					var c = !1;
					if (b.markedSpans)
						for (var d = 0; d < b.markedSpans; ++d) {
							var e = b.markedSpans[d];
							!e.collapsed || null != e.to && e.to != b.text.length || (c = !0)
						}
					var f = !c && O(a, b);
					if (f)
						return N(a, b, b.text.length, f.measure, "right").right;
					var g = _c(a, b, null, !0),
					h = g.appendChild(je(a.display.measure));
					return ee(a.display.measure, g),
					ge(h).right - ge(a.display.lineDiv).left
				}
					function T(a) {
					a.display.measureLineCache.length = a.display.measureLineCachePos = 0,
					a.display.cachedCharWidth = a.display.cachedTextHeight = null,
					a.options.lineWrapping || (a.display.maxLineChanged = !0),
					a.display.lineNumChars = null
				}
					function U() {
					return window.pageXOffset || (document.documentElement || document.body).scrollLeft
				}
					function V() {
					return window.pageYOffset || (document.documentElement || document.body).scrollTop
				}
					function W(a, b, c, d) {
					if (b.widgets)
						for (var e = 0; e < b.widgets.length; ++e)
							if (b.widgets[e].above) {
								var f = Sc(b.widgets[e]);
								c.top += f,
								c.bottom += f
							}
					if ("line" == d)
						return c;
					d || (d = "local");
					var g = qd(a, b);
					if ("local" == d ? g += K(a.display) : g -= a.display.viewOffset, "page" == d || "window" == d) {
						var h = ge(a.display.lineSpace);
						g += h.top + ("window" == d ? 0 : V());
						var i = h.left + ("window" == d ? 0 : U());
						c.left += i,
						c.right += i
					}
					return c.top += g,
					c.bottom += g,
					c
				}
					function X(a, b, c) {
					if ("div" == c)
						return b;
					var d = b.left,
					e = b.top;
					if ("page" == c)
						d -= U(), e -= V();
					else if ("local" == c || !c) {
						var f = ge(a.display.sizer);
						d += f.left,
						e += f.top
					}
					var g = ge(a.display.lineSpace);
					return {
						left : d - g.left,
						top : e - g.top
					}
				}
					function Y(a, b, c, d, e) {
					return d || (d = kd(a.doc, b.line)),
					W(a, d, N(a, d, b.ch, null, e), c)
				}
					function Z(a, b, c, d, e) {
					function f(b, f) {
						var g = N(a, d, b, e, f ? "right" : "left");
						return f ? g.left = g.right : g.right = g.left,
						W(a, d, g, c)
					}
					function g(a, b) {
						var c = h[b],
						d = c.level % 2;
						return a == le(c) && b && c.level < h[b - 1].level ? (c = h[--b], a = me(c) - (c.level % 2 ? 0 : 1), d = !0) : a == me(c) && b < h.length - 1 && c.level < h[b + 1].level && (c = h[++b], a = le(c) - c.level % 2, d = !1),
						d && a == c.to && a > c.from ? f(a - 1) : f(a, d)
					}
					d = d || kd(a.doc, b.line),
					e || (e = Q(a, d));
					var h = rd(d),
					i = b.ch;
					if (!h)
						return f(i);
					var j = se(h, i),
					k = g(i, j);
					return null != If && (k.other = g(i, If)),
					k
				}
					function $(a, b, c, d) {
					var e = new Sb(a, b);
					return e.xRel = d,
					c && (e.outside = !0),
					e
				}
					function _(a, b, c) {
					var d = a.doc;
					if (c += a.display.viewOffset, 0 > c)
						return $(d.first, 0, !0, -1);
					var e = pd(d, c),
					f = d.first + d.size - 1;
					if (e > f)
						return $(d.first + d.size - 1, kd(d, f).text.length, !0, 1);
					for (0 > b && (b = 0); ; ) {
						var g = kd(d, e),
						h = ab(a, g, e, b, c),
						i = Lc(g),
						j = i && i.find();
						if (!i || !(h.ch > j.from.ch || h.ch == j.from.ch && h.xRel > 0))
							return h;
						e = j.to.line
					}
				}
					function ab(a, b, c, d, e) {
					function f(d) {
						var e = Z(a, Sb(c, d), "line", b, j);
						return h = !0,
						g > e.bottom ? e.left - i : g < e.top ? e.left + i : (h = !1, e.left)
					}
					var g = e - qd(a, b),
					h = !1,
					i = 2 * a.display.wrapper.clientWidth,
					j = Q(a, b),
					k = rd(b),
					l = b.text.length,
					m = ne(b),
					n = oe(b),
					o = f(m),
					p = h,
					q = f(n),
					r = h;
					if (d > q)
						return $(c, n, r, 1);
					for (; ; ) {
						if (k ? n == m || n == ue(b, m, 1) : 1 >= n - m) {
							for (var s = o > d || q - d >= d - o ? m : n, t = d - (s == m ? o : q); Af.test(b.text.charAt(s)); )
								++s;
							var u = $(c, s, s == m ? p : r, 0 > t ? -1 : t ? 1 : 0);
							return u
						}
						var v = Math.ceil(l / 2),
						w = m + v;
						if (k) {
							w = m;
							for (var x = 0; v > x; ++x)
								w = ue(b, w, 1)
						}
						var y = f(w);
						y > d ? (n = w, q = y, (r = h) && (q += 1e3), l = v) : (m = w, o = y, p = h, l -= v)
					}
				}
					function bb(a) {
					if (null != a.cachedTextHeight)
						return a.cachedTextHeight;
					if (null == Oe) {
						Oe = ce("pre");
						for (var b = 0; 49 > b; ++b)
							Oe.appendChild(document.createTextNode("x")), Oe.appendChild(ce("br"));
						Oe.appendChild(document.createTextNode("x"))
					}
					ee(a.measure, Oe);
					var c = Oe.offsetHeight / 50;
					return c > 3 && (a.cachedTextHeight = c),
					de(a.measure),
					c || 1
				}
					function cb(a) {
					if (null != a.cachedCharWidth)
						return a.cachedCharWidth;
					var b = ce("span", "x"),
					c = ce("pre", [b]);
					ee(a.measure, c);
					var d = b.offsetWidth;
					return d > 2 && (a.cachedCharWidth = d),
					d || 10
				}
					function db(a) {
					a.curOp = {
						changes : [],
						forceUpdate : !1,
						updateInput : null,
						userSelChange : null,
						textChanged : null,
						selectionChanged : !1,
						cursorActivity : !1,
						updateMaxLine : !1,
						updateScrollPos : !1,
						id : ++Ve
					},
					vf++ || (uf = [])
				}
					function eb(a) {
					var b = a.curOp,
					c = a.doc,
					d = a.display;
					if (a.curOp = null, b.updateMaxLine && l(a), d.maxLineChanged && !a.options.lineWrapping && d.maxLine) {
						var e = S(a, d.maxLine);
						d.sizer.style.minWidth = Math.max(0, e + 3 + wf) + "px",
						d.maxLineChanged = !1;
						var f = Math.max(0, d.sizer.offsetLeft + d.sizer.offsetWidth - d.scroller.clientWidth);
						f < c.scrollLeft && !b.updateScrollPos && xb(a, Math.min(d.scroller.scrollLeft, f), !0)
					}
					var g,
					h;
					if (b.updateScrollPos)
						g = b.updateScrollPos;
					else if (b.selectionChanged && d.scroller.clientHeight) {
						var i = Z(a, c.sel.head);
						g = gc(a, i.left, i.top, i.left, i.bottom)
					}
					(b.changes.length || b.forceUpdate || g && null != g.scrollTop) && (h = t(a, b.changes, g && g.scrollTop, b.forceUpdate), a.display.scroller.offsetHeight && (a.doc.scrollTop = a.display.scroller.scrollTop)),
					!h && b.selectionChanged && C(a),
					b.updateScrollPos ? (d.scroller.scrollTop = d.scrollbarV.scrollTop = c.scrollTop = g.scrollTop, d.scroller.scrollLeft = d.scrollbarH.scrollLeft = c.scrollLeft = g.scrollLeft, p(a), b.scrollToPos && ec(a, Xb(a.doc, b.scrollToPos), b.scrollToPosMargin)) : g && dc(a),
					b.selectionChanged && F(a),
					a.state.focused && b.updateInput && mb(a, b.userSelChange);
					var j = b.maybeHiddenMarkers,
					k = b.maybeUnhiddenMarkers;
					if (j)
						for (var m = 0; m < j.length; ++m)
							j[m].lines.length || Md(j[m], "hide");
					if (k)
						for (var m = 0; m < k.length; ++m)
							k[m].lines.length && Md(k[m], "unhide");
					var n;
					if (--vf || (n = uf, uf = null), b.textChanged && Md(a, "change", a, b.textChanged), b.cursorActivity && Md(a, "cursorActivity", a), n)
						for (var m = 0; m < n.length; ++m)
							n[m]()
				}
					function fb(a, b) {
					return function () {
						var c = a || this,
						d = !c.curOp;
						d && db(c);
						try {
							var e = b.apply(c, arguments)
						}
						finally {
							d && eb(c)
						}
						return e
					}
				}
					function gb(a) {
					return function () {
						var b,
						c = this.cm && !this.cm.curOp;
						c && db(this.cm);
						try {
							b = a.apply(this, arguments)
						}
						finally {
							c && eb(this.cm)
						}
						return b
					}
				}
					function hb(a, b) {
					var c,
					d = !a.curOp;
					d && db(a);
					try {
						c = b()
					}
					finally {
						d && eb(a)
					}
					return c
				}
					function ib(a, b, c, d) {
					null == b && (b = a.doc.first),
					null == c && (c = a.doc.first + a.doc.size),
					a.curOp.changes.push({
						from : b,
						to : c,
						diff : d
					})
				}
					function jb(a) {
					a.display.pollingFast || a.display.poll.set(a.options.pollInterval, function () {
						lb(a),
						a.state.focused && jb(a)
					})
				}
					function kb(a) {
					function b() {
						var d = lb(a);
						d || c ? (a.display.pollingFast = !1, jb(a)) : (c = !0, a.display.poll.set(60, b))
					}
					var c = !1;
					a.display.pollingFast = !0,
					a.display.poll.set(20, b)
				}
					function lb(a) {
					var b = a.display.input,
					c = a.display.prevInput,
					d = a.doc,
					e = d.sel;
					if (!a.state.focused || Ff(b) || ob(a) || a.state.disableInput)
						return !1;
					a.state.pasteIncoming && a.state.fakedLastChar && (b.value = b.value.substring(0, b.value.length - 1), a.state.fakedLastChar = !1);
					var f = b.value;
					if (f == c && Tb(e.from, e.to))
						return !1;
					if (xe && !ze && a.display.inputHasSelection === f)
						return mb(a, !0), !1;
					var g = !a.curOp;
					g && db(a),
					e.shift = !1;
					for (var h = 0, i = Math.min(c.length, f.length); i > h && c.charCodeAt(h) == f.charCodeAt(h); )
						++h;
					var j = e.from,
					k = e.to;
					h < c.length ? j = Sb(j.line, j.ch - (c.length - h)) : a.state.overwrite && Tb(j, k) && !a.state.pasteIncoming && (k = Sb(k.line, Math.min(kd(d, k.line).text.length, k.ch + (f.length - h))));
					var l = a.curOp.updateInput,
					m = {
						from : j,
						to : k,
						text : Ef(f.slice(h)),
						origin : a.state.pasteIncoming ? "paste" : "+input"
					};
					return Lb(a.doc, m, "end"),
					a.curOp.updateInput = l,
					Nd(a, "inputRead", a, m),
					f.length > 1e3 || f.indexOf("\n") > -1 ? b.value = a.display.prevInput = "" : a.display.prevInput = f,
					g && eb(a),
					a.state.pasteIncoming = !1,
					!0
				}
					function mb(a, b) {
					var c,
					d,
					e = a.doc;
					if (Tb(e.sel.from, e.sel.to))
						b && (a.display.prevInput = a.display.input.value = "", xe && !ze && (a.display.inputHasSelection = null));
					else {
						a.display.prevInput = "",
						c = Gf && (e.sel.to.line - e.sel.from.line > 100 || (d = a.getSelection()).length > 1e3);
						var f = c ? "-" : d || a.getSelection();
						a.display.input.value = f,
						a.state.focused && Wd(a.display.input),
						xe && !ze && (a.display.inputHasSelection = f)
					}
					a.display.inaccurateSelection = c
				}
					function nb(a) {
					"nocursor" == a.options.readOnly || Ke && document.activeElement == a.display.input || a.display.input.focus()
				}
					function ob(a) {
					return a.options.readOnly || a.doc.cantEdit
				}
					function pb(a) {
					function b() {
						a.state.focused && setTimeout(_d(nb, a), 0)
					}
					function c() {
						null == h && (h = setTimeout(function () {
									h = null,
									g.cachedCharWidth = g.cachedTextHeight = Cf = null,
									T(a),
									hb(a, _d(ib, a))
								}, 100))
					}
					function d() {
						for (var a = g.wrapper.parentNode; a && a != document.body; a = a.parentNode);
						a ? setTimeout(d, 5e3) : Ld(window, "resize", c)
					}
					function e(b) {
						Od(a, b) || a.options.onDragEvent && a.options.onDragEvent(a, Dd(b)) || Hd(b)
					}
					function f() {
						g.inaccurateSelection && (g.prevInput = "", g.inaccurateSelection = !1, g.input.value = a.getSelection(), Wd(g.input))
					}
					var g = a.display;
					Kd(g.scroller, "mousedown", fb(a, sb)),
					xe ? Kd(g.scroller, "dblclick", fb(a, function (b) {
							if (!Od(a, b)) {
								var c = rb(a, b);
								if (c && !tb(a, b) && !qb(a.display, b)) {
									Ed(b);
									var d = nc(kd(a.doc, c.line).text, c);
									$b(a.doc, d.from, d.to)
								}
							}
						})) : Kd(g.scroller, "dblclick", function (b) {
						Od(a, b) || Ed(b)
					}),
					Kd(g.lineSpace, "selectstart", function (a) {
						qb(g, a) || Ed(a)
					}),
					Se || Kd(g.scroller, "contextmenu", function (b) {
						Hb(a, b)
					}),
					Kd(g.scroller, "scroll", function () {
						g.scroller.clientHeight && (wb(a, g.scroller.scrollTop), xb(a, g.scroller.scrollLeft, !0), Md(a, "scroll", a))
					}),
					Kd(g.scrollbarV, "scroll", function () {
						g.scroller.clientHeight && wb(a, g.scrollbarV.scrollTop)
					}),
					Kd(g.scrollbarH, "scroll", function () {
						g.scroller.clientHeight && xb(a, g.scrollbarH.scrollLeft)
					}),
					Kd(g.scroller, "mousewheel", function (b) {
						yb(a, b)
					}),
					Kd(g.scroller, "DOMMouseScroll", function (b) {
						yb(a, b)
					}),
					Kd(g.scrollbarH, "mousedown", b),
					Kd(g.scrollbarV, "mousedown", b),
					Kd(g.wrapper, "scroll", function () {
						g.wrapper.scrollTop = g.wrapper.scrollLeft = 0
					});
					var h;
					Kd(window, "resize", c),
					setTimeout(d, 5e3),
					Kd(g.input, "keyup", fb(a, function (b) {
							Od(a, b) || a.options.onKeyEvent && a.options.onKeyEvent(a, Dd(b)) || 16 == b.keyCode && (a.doc.sel.shift = !1)
						})),
					Kd(g.input, "input", _d(kb, a)),
					Kd(g.input, "keydown", fb(a, Db)),
					Kd(g.input, "keypress", fb(a, Eb)),
					Kd(g.input, "focus", _d(Fb, a)),
					Kd(g.input, "blur", _d(Gb, a)),
					a.options.dragDrop && (Kd(g.scroller, "dragstart", function (b) {
							vb(a, b)
						}), Kd(g.scroller, "dragenter", e), Kd(g.scroller, "dragover", e), Kd(g.scroller, "drop", fb(a, ub))),
					Kd(g.scroller, "paste", function (b) {
						qb(g, b) || (nb(a), kb(a))
					}),
					Kd(g.input, "paste", function () {
						if (Ae && !a.state.fakedLastChar && !(new Date - a.state.lastMiddleDown < 200)) {
							var b = g.input.selectionStart,
							c = g.input.selectionEnd;
							g.input.value += "$",
							g.input.selectionStart = b,
							g.input.selectionEnd = c,
							a.state.fakedLastChar = !0
						}
						a.state.pasteIncoming = !0,
						kb(a)
					}),
					Kd(g.input, "cut", f),
					Kd(g.input, "copy", f),
					Fe && Kd(g.sizer, "mouseup", function () {
						document.activeElement == g.input && g.input.blur(),
						nb(a)
					})
				}
					function qb(a, b) {
					for (var c = Id(b); c != a.wrapper; c = c.parentNode)
						if (!c || c.ignoreEvents || c.parentNode == a.sizer && c != a.mover)
							return !0
				}
					function rb(a, b, c) {
					var d = a.display;
					if (!c) {
						var e = Id(b);
						if (e == d.scrollbarH || e == d.scrollbarH.firstChild || e == d.scrollbarV || e == d.scrollbarV.firstChild || e == d.scrollbarFiller || e == d.gutterFiller)
							return null
					}
					var f,
					g,
					h = ge(d.lineSpace);
					try {
						f = b.clientX,
						g = b.clientY
					} catch (b) {
						return null
					}
					return _(a, f - h.left, g - h.top)
				}
					function sb(a) {
					function b(a) {
						if (!Tb(r, a)) {
							if (r = a, "single" == k)
								return $b(e.doc, Xb(g, i), a), void 0;
							if (p = Xb(g, p), q = Xb(g, q), "double" == k) {
								var b = nc(kd(g, a.line).text, a);
								Ub(a, p) ? $b(e.doc, b.from, q) : $b(e.doc, p, b.to)
							} else
								"triple" == k && (Ub(a, p) ? $b(e.doc, q, Xb(g, Sb(a.line, 0))) : $b(e.doc, p, Xb(g, Sb(a.line + 1, 0))))
						}
					}
					function c(a) {
						var d = ++t,
						h = rb(e, a, !0);
						if (h)
							if (Tb(h, m)) {
								var i = a.clientY < s.top ? -20 : a.clientY > s.bottom ? 20 : 0;
								i && setTimeout(fb(e, function () {
										t == d && (f.scroller.scrollTop += i, c(a))
									}), 50)
							} else {
								e.state.focused || Fb(e),
								m = h,
								b(h);
								var j = o(f, g);
								(h.line >= j.to || h.line < j.from) && setTimeout(fb(e, function () {
										t == d && c(a)
									}), 150)
							}
					}
					function d(a) {
						t = 1 / 0,
						Ed(a),
						nb(e),
						Ld(document, "mousemove", u),
						Ld(document, "mouseup", v)
					}
					if (!Od(this, a)) {
						var e = this,
						f = e.display,
						g = e.doc,
						h = g.sel;
						if (h.shift = a.shiftKey, qb(f, a))
							return Ae || (f.scroller.draggable = !1, setTimeout(function () {
									f.scroller.draggable = !0
								}, 100)), void 0;
						if (!tb(e, a)) {
							var i = rb(e, a);
							switch (Jd(a)) {
							case 3:
								return Se && Hb.call(e, e, a),
								void 0;
							case 2:
								return Ae && (e.state.lastMiddleDown = +new Date),
								i && $b(e.doc, i),
								setTimeout(_d(nb, e), 20),
								Ed(a),
								void 0
							}
							if (!i)
								return Id(a) == f.scroller && Ed(a), void 0;
							e.state.focused || Fb(e);
							var j = +new Date,
							k = "single";
							if (Qe && Qe.time > j - 400 && Tb(Qe.pos, i))
								k = "triple", Ed(a), setTimeout(_d(nb, e), 20), oc(e, i.line);
							else if (Pe && Pe.time > j - 400 && Tb(Pe.pos, i)) {
								k = "double",
								Qe = {
									time : j,
									pos : i
								},
								Ed(a);
								var l = nc(kd(g, i.line).text, i);
								$b(e.doc, l.from, l.to)
							} else
								Pe = {
									time : j,
									pos : i
								};
							var m = i;
							if (e.options.dragDrop && Bf && !ob(e) && !Tb(h.from, h.to) && !Ub(i, h.from) && !Ub(h.to, i) && "single" == k) {
								var n = fb(e, function (b) {
										Ae && (f.scroller.draggable = !1),
										e.state.draggingText = !1,
										Ld(document, "mouseup", n),
										Ld(f.scroller, "drop", n),
										Math.abs(a.clientX - b.clientX) + Math.abs(a.clientY - b.clientY) < 10 && (Ed(b), $b(e.doc, i), nb(e))
									});
								return Ae && (f.scroller.draggable = !0),
								e.state.draggingText = n,
								f.scroller.dragDrop && f.scroller.dragDrop(),
								Kd(document, "mouseup", n),
								Kd(f.scroller, "drop", n),
								void 0
							}
							Ed(a),
							"single" == k && $b(e.doc, Xb(g, i));
							var p = h.from,
							q = h.to,
							r = i,
							s = ge(f.wrapper),
							t = 0,
							u = fb(e, function (a) {
									xe || Jd(a) ? c(a) : d(a)
								}),
							v = fb(e, d);
							Kd(document, "mousemove", u),
							Kd(document, "mouseup", v)
						}
					}
				}
					function tb(a, b) {
					var c = a.display;
					try {
						var d = b.clientX,
						e = b.clientY
					} catch (b) {
						return !1
					}
					if (d >= Math.floor(ge(c.gutters).right))
						return !1;
					if (Ed(b), !Qd(a, "gutterClick"))
						return !0;
					var f = ge(c.lineDiv);
					if (e > f.bottom)
						return !0;
					e -= f.top - c.viewOffset;
					for (var g = 0; g < a.options.gutters.length; ++g) {
						var h = c.gutters.childNodes[g];
						if (h && ge(h).right >= d) {
							var i = pd(a.doc, e),
							j = a.options.gutters[g];
							Nd(a, "gutterClick", a, i, j, b);
							break
						}
					}
					return !0
				}
					function ub(a) {
					var b = this;
					if (!(Od(b, a) || qb(b.display, a) || b.options.onDragEvent && b.options.onDragEvent(b, Dd(a)))) {
						Ed(a),
						xe && (We = +new Date);
						var c = rb(b, a, !0),
						d = a.dataTransfer.files;
						if (c && !ob(b))
							if (d && d.length && window.FileReader && window.File)
								for (var e = d.length, f = Array(e), g = 0, h = function (a, d) {
									var h = new FileReader;
									h.onload = function () {
										f[d] = h.result,
										++g == e && (c = Xb(b.doc, c), Lb(b.doc, {
												from : c,
												to : c,
												text : Ef(f.join("\n")),
												origin : "paste"
											}, "around"))
									},
									h.readAsText(a)
								}, i = 0; e > i; ++i)
									h(d[i], i);
							else {
								if (b.state.draggingText && !Ub(c, b.doc.sel.from) && !Ub(b.doc.sel.to, c))
									return b.state.draggingText(a), setTimeout(_d(nb, b), 20), void 0;
								try {
									var f = a.dataTransfer.getData("Text");
									if (f) {
										var j = b.doc.sel.from,
										k = b.doc.sel.to;
										ac(b.doc, c, c),
										b.state.draggingText && Rb(b.doc, "", j, k, "paste"),
										b.replaceSelection(f, null, "paste"),
										nb(b),
										Fb(b)
									}
								} catch (a) {}

							}
					}
				}
					function vb(a, b) {
					if (xe && (!a.state.draggingText || +new Date - We < 100))
						return Hd(b), void 0;
					if (!Od(a, b) && !qb(a.display, b)) {
						var c = a.getSelection();
						if (b.dataTransfer.setData("Text", c), b.dataTransfer.setDragImage && !Ee) {
							var d = ce("img", null, null, "position: fixed; left: 0; top: 0;");
							De && (d.width = d.height = 1, a.display.wrapper.appendChild(d), d._top = d.offsetTop),
							b.dataTransfer.setDragImage(d, 0, 0),
							De && d.parentNode.removeChild(d)
						}
					}
				}
					function wb(a, b) {
					Math.abs(a.doc.scrollTop - b) < 2 || (a.doc.scrollTop = b, we || t(a, [], b), a.display.scroller.scrollTop != b && (a.display.scroller.scrollTop = b), a.display.scrollbarV.scrollTop != b && (a.display.scrollbarV.scrollTop = b), we && t(a, []), G(a, 100))
				}
					function xb(a, b, c) {
					(c ? b == a.doc.scrollLeft : Math.abs(a.doc.scrollLeft - b) < 2) || (b = Math.min(b, a.display.scroller.scrollWidth - a.display.scroller.clientWidth), a.doc.scrollLeft = b, p(a), a.display.scroller.scrollLeft != b && (a.display.scroller.scrollLeft = b), a.display.scrollbarH.scrollLeft != b && (a.display.scrollbarH.scrollLeft = b))
				}
					function yb(a, b) {
					var c = b.wheelDeltaX,
					d = b.wheelDeltaY;
					null == c && b.detail && b.axis == b.HORIZONTAL_AXIS && (c = b.detail),
					null == d && b.detail && b.axis == b.VERTICAL_AXIS ? d = b.detail : null == d && (d = b.wheelDelta);
					var e = a.display,
					f = e.scroller;
					if (c && f.scrollWidth > f.clientWidth || d && f.scrollHeight > f.clientHeight) {
						if (d && Le && Ae)
							for (var g = b.target; g != f; g = g.parentNode)
								if (g.lineObj) {
									a.display.currentWheelTarget = g;
									break
								}
						if (c && !we && !De && null != Ye)
							return d && wb(a, Math.max(0, Math.min(f.scrollTop + d * Ye, f.scrollHeight - f.clientHeight))), xb(a, Math.max(0, Math.min(f.scrollLeft + c * Ye, f.scrollWidth - f.clientWidth))), Ed(b), e.wheelStartX = null, void 0;
						if (d && null != Ye) {
							var h = d * Ye,
							i = a.doc.scrollTop,
							j = i + e.wrapper.clientHeight;
							0 > h ? i = Math.max(0, i + h - 50) : j = Math.min(a.doc.height, j + h + 50),
							t(a, [], {
								top : i,
								bottom : j
							})
						}
						20 > Xe && (null == e.wheelStartX ? (e.wheelStartX = f.scrollLeft, e.wheelStartY = f.scrollTop, e.wheelDX = c, e.wheelDY = d, setTimeout(function () {
									if (null != e.wheelStartX) {
										var a = f.scrollLeft - e.wheelStartX,
										b = f.scrollTop - e.wheelStartY,
										c = b && e.wheelDY && b / e.wheelDY || a && e.wheelDX && a / e.wheelDX;
										e.wheelStartX = e.wheelStartY = null,
										c && (Ye = (Ye * Xe + c) / (Xe + 1), ++Xe)
									}
								}, 200)) : (e.wheelDX += c, e.wheelDY += d))
					}
				}
					function zb(a, b, c) {
					if ("string" == typeof b && (b = kf[b], !b))
						return !1;
					a.display.pollingFast && lb(a) && (a.display.pollingFast = !1);
					var d = a.doc,
					e = d.sel.shift,
					f = !1;
					try {
						ob(a) && (a.state.suppressEdits = !0),
						c && (d.sel.shift = !1),
						f = b(a) != xf
					}
					finally {
						d.sel.shift = e,
						a.state.suppressEdits = !1
					}
					return f
				}
					function Ab(a) {
					var b = a.state.keyMaps.slice(0);
					return a.options.extraKeys && b.push(a.options.extraKeys),
					b.push(a.options.keyMap),
					b
				}
					function Bb(a, b) {
					var c = sc(a.options.keyMap),
					d = c.auto;
					clearTimeout(Ze),
					d && !uc(b) && (Ze = setTimeout(function () {
								sc(a.options.keyMap) == c && (a.options.keyMap = d.call ? d.call(null, a) : d, g(a))
							}, 50));
					var e = vc(b, !0),
					f = !1;
					if (!e)
						return !1;
					var h = Ab(a);
					return f = b.shiftKey ? tc("Shift-" + e, h, function (b) {
							return zb(a, b, !0)
						}) || tc(e, h, function (b) {
							return ("string" == typeof b ? /^go[A-Z]/.test(b) : b.motion) ? zb(a, b) : void 0
						}) : tc(e, h, function (b) {
							return zb(a, b)
						}),
					f && (Ed(b), F(a), ze && (b.oldKeyCode = b.keyCode, b.keyCode = 0), Nd(a, "keyHandled", a, e, b)),
					f
				}
					function Cb(a, b, c) {
					var d = tc("'" + c + "'", Ab(a), function (b) {
							return zb(a, b, !0)
						});
					return d && (Ed(b), F(a), Nd(a, "keyHandled", a, "'" + c + "'", b)),
					d
				}
					function Db(a) {
					var b = this;
					if (b.state.focused || Fb(b), !(Od(b, a) || b.options.onKeyEvent && b.options.onKeyEvent(b, Dd(a)))) {
						xe && 27 == a.keyCode && (a.returnValue = !1);
						var c = a.keyCode;
						b.doc.sel.shift = 16 == c || a.shiftKey;
						var d = Bb(b, a);
						De && (_e = d ? c : null, !d && 88 == c && !Gf && (Le ? a.metaKey : a.ctrlKey) && b.replaceSelection(""))
					}
				}
					function Eb(a) {
					var b = this;
					if (!(Od(b, a) || b.options.onKeyEvent && b.options.onKeyEvent(b, Dd(a)))) {
						var c = a.keyCode,
						d = a.charCode;
						if (De && c == _e)
							return _e = null, Ed(a), void 0;
						if (!(De && (!a.which || a.which < 10) || Fe) || !Bb(b, a)) {
							var e = String.fromCharCode(null == d ? c : d);
							this.options.electricChars && this.doc.mode.electricChars && this.options.smartIndent && !ob(this) && this.doc.mode.electricChars.indexOf(e) > -1 && setTimeout(fb(b, function () {
									jc(b, b.doc.sel.to.line, "smart")
								}), 75),
							Cb(b, a, e) || (xe && !ze && (b.display.inputHasSelection = null), kb(b))
						}
					}
				}
					function Fb(a) {
					"nocursor" != a.options.readOnly && (a.state.focused || (Md(a, "focus", a), a.state.focused = !0, -1 == a.display.wrapper.className.search(/\bCodeMirror-focused\b/) && (a.display.wrapper.className += " CodeMirror-focused"), a.curOp || (mb(a, !0), Ae && setTimeout(_d(mb, a, !0), 0))), jb(a), F(a))
				}
					function Gb(a) {
					a.state.focused && (Md(a, "blur", a), a.state.focused = !1, a.display.wrapper.className = a.display.wrapper.className.replace(" CodeMirror-focused", "")),
					clearInterval(a.display.blinker),
					setTimeout(function () {
						a.state.focused || (a.doc.sel.shift = !1)
					}, 150)
				}
					function Hb(a, b) {
					function c() {
						if (null != e.input.selectionStart) {
							var a = e.input.value = " " + (Tb(f.from, f.to) ? "" : e.input.value);
							e.prevInput = " ",
							e.input.selectionStart = 1,
							e.input.selectionEnd = a.length
						}
					}
					function d() {
						if (e.inputDiv.style.position = "relative", e.input.style.cssText = i, ze && (e.scrollbarV.scrollTop = e.scroller.scrollTop = h), jb(a), null != e.input.selectionStart) {
							(!xe || ze) && c(),
							clearTimeout($e);
							var b = 0,
							d = function () {
								" " == e.prevInput && 0 == e.input.selectionStart ? fb(a, kf.selectAll)(a) : b++ < 10 ? $e = setTimeout(d, 500) : mb(a)
							};
							$e = setTimeout(d, 200)
						}
					}
					if (!Od(a, b, "contextmenu")) {
						var e = a.display,
						f = a.doc.sel;
						if (!qb(e, b)) {
							var g = rb(a, b),
							h = e.scroller.scrollTop;
							if (g && !De) {
								(Tb(f.from, f.to) || Ub(g, f.from) || !Ub(g, f.to)) && fb(a, ac)(a.doc, g, g);
								var i = e.input.style.cssText;
								if (e.inputDiv.style.position = "absolute", e.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (b.clientY - 5) + "px; left: " + (b.clientX - 5) + "px; z-index: 1000; background: white; outline: none;" + "border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);", nb(a), mb(a, !0), Tb(f.from, f.to) && (e.input.value = e.prevInput = " "), xe && !ze && c(), Se) {
									Hd(b);
									var j = function () {
										Ld(window, "mouseup", j),
										setTimeout(d, 20)
									};
									Kd(window, "mouseup", j)
								} else
									setTimeout(d, 50)
							}
						}
					}
				}
					function Ib(a, b, c) {
					if (!Ub(b.from, c))
						return Xb(a, c);
					var d = b.text.length - 1 - (b.to.line - b.from.line);
					if (c.line > b.to.line + d) {
						var e = c.line - d,
						f = a.first + a.size - 1;
						return e > f ? Sb(f, kd(a, f).text.length) : Yb(c, kd(a, e).text.length)
					}
					if (c.line == b.to.line + d)
						return Yb(c, Vd(b.text).length + (1 == b.text.length ? b.from.ch : 0) + kd(a, b.to.line).text.length - b.to.ch);
					var g = c.line - b.from.line;
					return Yb(c, b.text[g].length + (g ? 0 : b.from.ch))
				}
					function Jb(a, b, c) {
					if (c && "object" == typeof c)
						return {
							anchor : Ib(a, b, c.anchor),
							head : Ib(a, b, c.head)
						};
					if ("start" == c)
						return {
							anchor : b.from,
							head : b.from
						};
					var d = af(b);
					if ("around" == c)
						return {
							anchor : b.from,
							head : d
						};
					if ("end" == c)
						return {
							anchor : d,
							head : d
						};
					var e = function (a) {
						if (Ub(a, b.from))
							return a;
						if (!Ub(b.to, a))
							return d;
						var c = a.line + b.text.length - (b.to.line - b.from.line) - 1,
						e = a.ch;
						return a.line == b.to.line && (e += d.ch - b.to.ch),
						Sb(c, e)
					};
					return {
						anchor : e(a.sel.anchor),
						head : e(a.sel.head)
					}
				}
					function Kb(a, b, c) {
					var d = {
						canceled : !1,
						from : b.from,
						to : b.to,
						text : b.text,
						origin : b.origin,
						cancel : function () {
							this.canceled = !0
						}
					};
					return c && (d.update = function (b, c, d, e) {
						b && (this.from = Xb(a, b)),
						c && (this.to = Xb(a, c)),
						d && (this.text = d),
						void 0 !== e && (this.origin = e)
					}),
					Md(a, "beforeChange", a, d),
					a.cm && Md(a.cm, "beforeChange", a.cm, d),
					d.canceled ? null : {
						from : d.from,
						to : d.to,
						text : d.text,
						origin : d.origin
					}
				}
					function Lb(a, b, c, d) {
					if (a.cm) {
						if (!a.cm.curOp)
							return fb(a.cm, Lb)(a, b, c, d);
						if (a.cm.state.suppressEdits)
							return
					}
					if (!(Qd(a, "beforeChange") || a.cm && Qd(a.cm, "beforeChange")) || (b = Kb(a, b, !0))) {
						var e = Te && !d && Ic(a, b.from, b.to);
						if (e) {
							for (var f = e.length - 1; f >= 1; --f)
								Mb(a, {
									from : e[f].from,
									to : e[f].to,
									text : [""]
								});
							e.length && Mb(a, {
								from : e[0].from,
								to : e[0].to,
								text : b.text
							}, c)
						} else
							Mb(a, b, c)
					}
				}
					function Mb(a, b, c) {
					var d = Jb(a, b, c);
					vd(a, b, d, a.cm ? a.cm.curOp.id : 0 / 0),
					Pb(a, b, d, Gc(a, b));
					var e = [];
					id(a, function (a, c) {
						c || -1 != Xd(e, a.history) || (Bd(a.history, b), e.push(a.history)),
						Pb(a, b, null, Gc(a, b))
					})
				}
					function Nb(a, b) {
					if (!a.cm || !a.cm.state.suppressEdits) {
						var c = a.history,
						d = ("undo" == b ? c.done : c.undone).pop();
						if (d) {
							var e = {
								changes : [],
								anchorBefore : d.anchorAfter,
								headBefore : d.headAfter,
								anchorAfter : d.anchorBefore,
								headAfter : d.headBefore,
								generation : c.generation
							};
							("undo" == b ? c.undone : c.done).push(e),
							c.generation = d.generation || ++c.maxGeneration;
							for (var f = Qd(a, "beforeChange") || a.cm && Qd(a.cm, "beforeChange"), g = d.changes.length - 1; g >= 0; --g) {
								var h = d.changes[g];
								if (h.origin = b, f && !Kb(a, h, !1))
									return ("undo" == b ? c.done : c.undone).length = 0, void 0;
								e.changes.push(ud(a, h));
								var i = g ? Jb(a, h, null) : {
									anchor : d.anchorBefore,
									head : d.headBefore
								};
								Pb(a, h, i, Hc(a, h));
								var j = [];
								id(a, function (a, b) {
									b || -1 != Xd(j, a.history) || (Bd(a.history, h), j.push(a.history)),
									Pb(a, h, null, Hc(a, h))
								})
							}
						}
					}
				}
					function Ob(a, b) {
					function c(a) {
						return Sb(a.line + b, a.ch)
					}
					a.first += b,
					a.cm && ib(a.cm, a.first, a.first, b),
					a.sel.head = c(a.sel.head),
					a.sel.anchor = c(a.sel.anchor),
					a.sel.from = c(a.sel.from),
					a.sel.to = c(a.sel.to)
				}
					function Pb(a, b, c, d) {
					if (a.cm && !a.cm.curOp)
						return fb(a.cm, Pb)(a, b, c, d);
					if (b.to.line < a.first)
						return Ob(a, b.text.length - 1 - (b.to.line - b.from.line)), void 0;
					if (!(b.from.line > a.lastLine())) {
						if (b.from.line < a.first) {
							var e = b.text.length - 1 - (a.first - b.from.line);
							Ob(a, e),
							b = {
								from : Sb(a.first, 0),
								to : Sb(b.to.line + e, b.to.ch),
								text : [Vd(b.text)],
								origin : b.origin
							}
						}
						var f = a.lastLine();
						b.to.line > f && (b = {
								from : b.from,
								to : Sb(f, kd(a, f).text.length),
								text : [b.text[0]],
								origin : b.origin
							}),
						b.removed = ld(a, b.from, b.to),
						c || (c = Jb(a, b, null)),
						a.cm ? Qb(a.cm, b, d, c) : fd(a, b, d, c)
					}
				}
					function Qb(a, b, c, d) {
					var f = a.doc,
					g = a.display,
					h = b.from,
					i = b.to,
					j = !1,
					l = h.line;
					a.options.lineWrapping || (l = od(Mc(f, kd(f, h.line))), f.iter(l, i.line + 1, function (a) {
							return a == g.maxLine ? (j = !0, !0) : void 0
						})),
					Ub(f.sel.head, b.from) || Ub(b.to, f.sel.head) || (a.curOp.cursorActivity = !0),
					fd(f, b, c, d, e(a)),
					a.options.lineWrapping || (f.iter(l, h.line + b.text.length, function (a) {
							var b = k(f, a);
							b > g.maxLineLength && (g.maxLine = a, g.maxLineLength = b, g.maxLineChanged = !0, j = !1)
						}), j && (a.curOp.updateMaxLine = !0)),
					f.frontier = Math.min(f.frontier, h.line),
					G(a, 400);
					var m = b.text.length - (i.line - h.line) - 1;
					if (ib(a, h.line, i.line + 1, m), Qd(a, "change")) {
						var n = {
							from : h,
							to : i,
							text : b.text,
							removed : b.removed,
							origin : b.origin
						};
						if (a.curOp.textChanged) {
							for (var o = a.curOp.textChanged; o.next; o = o.next);
							o.next = n
						} else
							a.curOp.textChanged = n
					}
				}
					function Rb(a, b, c, d, e) {
					if (d || (d = c), Ub(d, c)) {
						var f = d;
						d = c,
						c = f
					}
					"string" == typeof b && (b = Ef(b)),
					Lb(a, {
						from : c,
						to : d,
						text : b,
						origin : e
					}, null)
				}
					function Sb(a, b) {
					return this instanceof Sb ? (this.line = a, this.ch = b, void 0) : new Sb(a, b)
				}
					function Tb(a, b) {
					return a.line == b.line && a.ch == b.ch
				}
					function Ub(a, b) {
					return a.line < b.line || a.line == b.line && a.ch < b.ch
				}
					function Vb(a) {
					return Sb(a.line, a.ch)
				}
					function Wb(a, b) {
					return Math.max(a.first, Math.min(b, a.first + a.size - 1))
				}
					function Xb(a, b) {
					if (b.line < a.first)
						return Sb(a.first, 0);
					var c = a.first + a.size - 1;
					return b.line > c ? Sb(c, kd(a, c).text.length) : Yb(b, kd(a, b.line).text.length)
				}
					function Yb(a, b) {
					var c = a.ch;
					return null == c || c > b ? Sb(a.line, b) : 0 > c ? Sb(a.line, 0) : a
				}
					function Zb(a, b) {
					return b >= a.first && b < a.first + a.size
				}
					function $b(a, b, c, d) {
					if (a.sel.shift || a.sel.extend) {
						var e = a.sel.anchor;
						if (c) {
							var f = Ub(b, e);
							f != Ub(c, e) ? (e = b, b = c) : f != Ub(b, c) && (b = c)
						}
						ac(a, e, b, d)
					} else
						ac(a, b, c || b, d);
					a.cm && (a.cm.curOp.userSelChange = !0)
				}
					function _b(a, b, c) {
					var d = {
						anchor : b,
						head : c
					};
					return Md(a, "beforeSelectionChange", a, d),
					a.cm && Md(a.cm, "beforeSelectionChange", a.cm, d),
					d.anchor = Xb(a, d.anchor),
					d.head = Xb(a, d.head),
					d
				}
					function ac(a, b, c, d, e) {
					if (!e && Qd(a, "beforeSelectionChange") || a.cm && Qd(a.cm, "beforeSelectionChange")) {
						var f = _b(a, b, c);
						c = f.head,
						b = f.anchor
					}
					var g = a.sel;
					if (g.goalColumn = null, (e || !Tb(b, g.anchor)) && (b = cc(a, b, d, "push" != e)), (e || !Tb(c, g.head)) && (c = cc(a, c, d, "push" != e)), !Tb(g.anchor, b) || !Tb(g.head, c)) {
						g.anchor = b,
						g.head = c;
						var h = Ub(c, b);
						g.from = h ? c : b,
						g.to = h ? b : c,
						a.cm && (a.cm.curOp.updateInput = a.cm.curOp.selectionChanged = a.cm.curOp.cursorActivity = !0),
						Nd(a, "cursorActivity", a)
					}
				}
					function bc(a) {
					ac(a.doc, a.doc.sel.from, a.doc.sel.to, null, "push")
				}
					function cc(a, b, c, d) {
					var e = !1,
					f = b,
					g = c || 1;
					a.cantEdit = !1;
					a : for (; ; ) {
						var h = kd(a, f.line);
						if (h.markedSpans)
							for (var i = 0; i < h.markedSpans.length; ++i) {
								var j = h.markedSpans[i],
								k = j.marker;
								if ((null == j.from || (k.inclusiveLeft ? j.from <= f.ch : j.from < f.ch)) && (null == j.to || (k.inclusiveRight ? j.to >= f.ch : j.to > f.ch))) {
									if (d && (Md(k, "beforeCursorEnter"), k.explicitlyCleared)) {
										if (h.markedSpans) {
											--i;
											continue
										}
										break
									}
									if (!k.atomic)
										continue;
									var l = k.find()[0 > g ? "from" : "to"];
									if (Tb(l, f) && (l.ch += g, l.ch < 0 ? l = l.line > a.first ? Xb(a, Sb(l.line - 1)) : null : l.ch > h.text.length && (l = l.line < a.first + a.size - 1 ? Sb(l.line + 1, 0) : null), !l)) {
										if (e)
											return d ? (a.cantEdit = !0, Sb(a.first, 0)) : cc(a, b, c, !0);
										e = !0,
										l = b,
										g = -g
									}
									f = l;
									continue a
								}
							}
						return f
					}
				}
					function dc(a) {
					var b = ec(a, a.doc.sel.head, a.options.cursorScrollMargin);
					if (a.state.focused) {
						var c = a.display,
						d = ge(c.sizer),
						e = null;
						if (b.top + d.top < 0 ? e = !0 : b.bottom + d.top > (window.innerHeight || document.documentElement.clientHeight) && (e = !1), null != e && !Ie) {
							var f = "none" == c.cursor.style.display;
							f && (c.cursor.style.display = "", c.cursor.style.left = b.left + "px", c.cursor.style.top = b.top - c.viewOffset + "px"),
							c.cursor.scrollIntoView(e),
							f && (c.cursor.style.display = "none")
						}
					}
				}
					function ec(a, b, c) {
					for (null == c && (c = 0); ; ) {
						var d = !1,
						e = Z(a, b),
						f = gc(a, e.left, e.top - c, e.left, e.bottom + c),
						g = a.doc.scrollTop,
						h = a.doc.scrollLeft;
						if (null != f.scrollTop && (wb(a, f.scrollTop), Math.abs(a.doc.scrollTop - g) > 1 && (d = !0)), null != f.scrollLeft && (xb(a, f.scrollLeft), Math.abs(a.doc.scrollLeft - h) > 1 && (d = !0)), !d)
							return e
					}
				}
					function fc(a, b, c, d, e) {
					var f = gc(a, b, c, d, e);
					null != f.scrollTop && wb(a, f.scrollTop),
					null != f.scrollLeft && xb(a, f.scrollLeft)
				}
					function gc(a, b, c, d, e) {
					var f = a.display,
					g = bb(a.display);
					0 > c && (c = 0);
					var h = f.scroller.clientHeight - wf,
					i = f.scroller.scrollTop,
					j = {},
					k = a.doc.height + L(f),
					l = g > c,
					m = e > k - g;
					if (i > c)
						j.scrollTop = l ? 0 : c;
					else if (e > i + h) {
						var n = Math.min(c, (m ? k : e) - h);
						n != i && (j.scrollTop = n)
					}
					var o = f.scroller.clientWidth - wf,
					p = f.scroller.scrollLeft;
					b += f.gutters.offsetWidth,
					d += f.gutters.offsetWidth;
					var q = f.gutters.offsetWidth,
					r = q + 10 > b;
					return p + q > b || r ? (r && (b = 0), j.scrollLeft = Math.max(0, b - 10 - q)) : d > o + p - 3 && (j.scrollLeft = d + 10 - o),
					j
				}
					function hc(a, b, c) {
					a.curOp.updateScrollPos = {
						scrollLeft : null == b ? a.doc.scrollLeft : b,
						scrollTop : null == c ? a.doc.scrollTop : c
					}
				}
					function ic(a, b, c) {
					var d = a.curOp.updateScrollPos || (a.curOp.updateScrollPos = {
								scrollLeft : a.doc.scrollLeft,
								scrollTop : a.doc.scrollTop
							}),
					e = a.display.scroller;
					d.scrollTop = Math.max(0, Math.min(e.scrollHeight - e.clientHeight, d.scrollTop + c)),
					d.scrollLeft = Math.max(0, Math.min(e.scrollWidth - e.clientWidth, d.scrollLeft + b))
				}
					function jc(a, b, c, d) {
					var e = a.doc;
					if (null == c && (c = "add"), "smart" == c)
						if (a.doc.mode.indent)
							var f = J(a, b);
						else
							c = "prev";
					var g,
					h = a.options.tabSize,
					i = kd(e, b),
					j = Td(i.text, null, h),
					k = i.text.match(/^\s*/)[0];
					if ("smart" == c && (g = a.doc.mode.indent(f, i.text.slice(k.length), i.text), g == xf)) {
						if (!d)
							return;
						c = "prev"
					}
					"prev" == c ? g = b > e.first ? Td(kd(e, b - 1).text, null, h) : 0 : "add" == c ? g = j + a.options.indentUnit : "subtract" == c ? g = j - a.options.indentUnit : "number" == typeof c && (g = j + c),
					g = Math.max(0, g);
					var l = "",
					m = 0;
					if (a.options.indentWithTabs)
						for (var n = Math.floor(g / h); n; --n)
							m += h, l += "	";
					g > m && (l += Ud(g - m)),
					l != k && Rb(a.doc, l, Sb(b, 0), Sb(b, k.length), "+input"),
					i.stateAfter = null
				}
					function kc(a, b, c) {
					var d = b,
					e = b,
					f = a.doc;
					return "number" == typeof b ? e = kd(f, Wb(f, b)) : d = od(b),
					null == d ? null : c(e, d) ? (ib(a, d, d + 1), e) : null
				}
					function lc(a, b, c, d, e) {
					function f() {
						var b = h + c;
						return b < a.first || b >= a.first + a.size ? l = !1 : (h = b, k = kd(a, b))
					}
					function g(a) {
						var b = (e ? ue : ve)(k, i, c, !0);
						if (null == b) {
							if (a || !f())
								return l = !1;
							i = e ? (0 > c ? oe : ne)(k) : 0 > c ? k.text.length : 0
						} else
							i = b;
						return !0
					}
					var h = b.line,
					i = b.ch,
					j = c,
					k = kd(a, h),
					l = !0;
					if ("char" == d)
						g();
					else if ("column" == d)
						g(!0);
					else if ("word" == d || "group" == d)
						for (var m = null, n = "group" == d, o = !0; !(0 > c) || g(!o); o = !1) {
							var p = k.text.charAt(i) || "\n",
							q = ae(p) ? "w" : n ? /\s/.test(p) ? null : "p" : null;
							if (m && m != q) {
								0 > c && (c = 1, g());
								break
							}
							if (q && (m = q), c > 0 && !g(!o))
								break
						}
					var r = cc(a, Sb(h, i), j, !0);
					return l || (r.hitSide = !0),
					r
				}
					function mc(a, b, c, d) {
					var e,
					f = a.doc,
					g = b.left;
					if ("page" == d) {
						var h = Math.min(a.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
						e = b.top + c * (h - (0 > c ? 1.5 : .5) * bb(a.display))
					} else
						"line" == d && (e = c > 0 ? b.bottom + 3 : b.top - 3);
					for (; ; ) {
						var i = _(a, g, e);
						if (!i.outside)
							break;
						if (0 > c ? 0 >= e : e >= f.height) {
							i.hitSide = !0;
							break
						}
						e += 5 * c
					}
					return i
				}
					function nc(a, b) {
					var c = b.ch,
					d = b.ch;
					if (a) {
						(b.xRel < 0 || d == a.length) && c ? --c : ++d;
						for (var e = a.charAt(c), f = ae(e) ? ae : /\s/.test(e) ? function (a) {
							return /\s/.test(a)
						}
							 : function (a) {
							return !/\s/.test(a) && !ae(a)
						}; c > 0 && f(a.charAt(c - 1)); )
							--c;
						for (; d < a.length && f(a.charAt(d)); )
							++d
					}
					return {
						from : Sb(b.line, c),
						to : Sb(b.line, d)
					}
				}
					function oc(a, b) {
					$b(a.doc, Sb(b, 0), Xb(a.doc, Sb(b + 1, 0)))
				}
					function pc(b, c, d, e) {
					a.defaults[b] = c,
					d && (bf[b] = e ? function (a, b, c) {
						c != df && d(a, b, c)
					}
						 : d)
				}
					function qc(a, b) {
					if (b === !0)
						return b;
					if (a.copyState)
						return a.copyState(b);
					var c = {};
					for (var d in b) {
						var e = b[d];
						e instanceof Array && (e = e.concat([])),
						c[d] = e
					}
					return c
				}
					function rc(a, b, c) {
					return a.startState ? a.startState(b, c) : !0
				}
					function sc(a) {
					return "string" == typeof a ? lf[a] : a
				}
					function tc(a, b, c) {
					function d(b) {
						b = sc(b);
						var e = b[a];
						if (e === !1)
							return "stop";
						if (null != e && c(e))
							return !0;
						if (b.nofallthrough)
							return "stop";
						var f = b.fallthrough;
						if (null == f)
							return !1;
						if ("[object Array]" != Object.prototype.toString.call(f))
							return d(f);
						for (var g = 0, h = f.length; h > g; ++g) {
							var i = d(f[g]);
							if (i)
								return i
						}
						return !1
					}
					for (var e = 0; e < b.length; ++e) {
						var f = d(b[e]);
						if (f)
							return "stop" != f
					}
				}
					function uc(a) {
					var b = Hf[a.keyCode];
					return "Ctrl" == b || "Alt" == b || "Shift" == b || "Mod" == b
				}
					function vc(a, b) {
					if (De && 34 == a.keyCode && a["char"])
						return !1;
					var c = Hf[a.keyCode];
					return null == c || a.altGraphKey ? !1 : (a.altKey && (c = "Alt-" + c), (Re ? a.metaKey : a.ctrlKey) && (c = "Ctrl-" + c), (Re ? a.ctrlKey : a.metaKey) && (c = "Cmd-" + c), !b && a.shiftKey && (c = "Shift-" + c), c)
				}
					function wc(a, b) {
					this.pos = this.start = 0,
					this.string = a,
					this.tabSize = b || 8,
					this.lastColumnPos = this.lastColumnValue = 0
				}
					function xc(a, b) {
					this.lines = [],
					this.type = b,
					this.doc = a
				}
					function yc(a, b, c, d, e) {
					if (d && d.shared)
						return Ac(a, b, c, d, e);
					if (a.cm && !a.cm.curOp)
						return fb(a.cm, yc)(a, b, c, d, e);
					var f = new xc(a, e);
					if ("range" == e && !Ub(b, c))
						return f;
					d && Zd(d, f),
					f.replacedWith && (f.collapsed = !0, f.replacedWith = ce("span", [f.replacedWith], "CodeMirror-widget"), d.handleMouseEvents || (f.replacedWith.ignoreEvents = !0)),
					f.collapsed && (Ue = !0),
					f.addToHistory && vd(a, {
						from : b,
						to : c,
						origin : "markText"
					}, {
						head : a.sel.head,
						anchor : a.sel.anchor
					}, 0 / 0);
					var g,
					h,
					i,
					j = b.line,
					k = 0,
					l = a.cm;
					if (a.iter(j, c.line + 1, function (d) {
							l && f.collapsed && !l.options.lineWrapping && Mc(a, d) == l.display.maxLine && (i = !0);
							var e = {
								from : null,
								to : null,
								marker : f
							};
							k += d.text.length,
							j == b.line && (e.from = b.ch, k -= b.ch),
							j == c.line && (e.to = c.ch, k -= d.text.length - c.ch),
							f.collapsed && (j == c.line && (h = Jc(d, c.ch)), j == b.line ? g = Jc(d, b.ch) : nd(d, 0)),
							Dc(d, e),
							++j
						}), f.collapsed && a.iter(b.line, c.line + 1, function (b) {
							Nc(a, b) && nd(b, 0)
						}), f.clearOnEnter && Kd(f, "beforeCursorEnter", function () {
							f.clear()
						}), f.readOnly && (Te = !0, (a.history.done.length || a.history.undone.length) && a.clearHistory()), f.collapsed) {
						if (g != h)
							throw new Error("Inserting collapsed marker overlapping an existing one");
						f.size = k,
						f.atomic = !0
					}
					return l && (i && (l.curOp.updateMaxLine = !0), (f.className || f.title || f.startStyle || f.endStyle || f.collapsed) && ib(l, b.line, c.line + 1), f.atomic && bc(l)),
					f
				}
					function zc(a, b) {
					this.markers = a,
					this.primary = b;
					for (var c = 0, d = this; c < a.length; ++c)
						a[c].parent = this, Kd(a[c], "clear", function () {
							d.clear()
						})
				}
					function Ac(a, b, c, d, e) {
					d = Zd(d),
					d.shared = !1;
					var f = [yc(a, b, c, d, e)],
					g = f[0],
					h = d.replacedWith;
					return id(a, function (a) {
						h && (d.replacedWith = h.cloneNode(!0)),
						f.push(yc(a, Xb(a, b), Xb(a, c), d, e));
						for (var i = 0; i < a.linked.length; ++i)
							if (a.linked[i].isParent)
								return;
						g = Vd(f)
					}),
					new zc(f, g)
				}
					function Bc(a, b) {
					if (a)
						for (var c = 0; c < a.length; ++c) {
							var d = a[c];
							if (d.marker == b)
								return d
						}
				}
					function Cc(a, b) {
					for (var c, d = 0; d < a.length; ++d)
						a[d] != b && (c || (c = [])).push(a[d]);
					return c
				}
					function Dc(a, b) {
					a.markedSpans = a.markedSpans ? a.markedSpans.concat([b]) : [b],
					b.marker.attachLine(a)
				}
					function Ec(a, b, c) {
					if (a)
						for (var d, e = 0; e < a.length; ++e) {
							var f = a[e],
							g = f.marker,
							h = null == f.from || (g.inclusiveLeft ? f.from <= b : f.from < b);
							if (h || "bookmark" == g.type && f.from == b && (!c || !f.marker.insertLeft)) {
								var i = null == f.to || (g.inclusiveRight ? f.to >= b : f.to > b);
								(d || (d = [])).push({
									from : f.from,
									to : i ? null : f.to,
									marker : g
								})
							}
						}
					return d
				}
					function Fc(a, b, c) {
					if (a)
						for (var d, e = 0; e < a.length; ++e) {
							var f = a[e],
							g = f.marker,
							h = null == f.to || (g.inclusiveRight ? f.to >= b : f.to > b);
							if (h || "bookmark" == g.type && f.from == b && (!c || f.marker.insertLeft)) {
								var i = null == f.from || (g.inclusiveLeft ? f.from <= b : f.from < b);
								(d || (d = [])).push({
									from : i ? null : f.from - b,
									to : null == f.to ? null : f.to - b,
									marker : g
								})
							}
						}
					return d
				}
					function Gc(a, b) {
					var c = Zb(a, b.from.line) && kd(a, b.from.line).markedSpans,
					d = Zb(a, b.to.line) && kd(a, b.to.line).markedSpans;
					if (!c && !d)
						return null;
					var e = b.from.ch,
					f = b.to.ch,
					g = Tb(b.from, b.to),
					h = Ec(c, e, g),
					i = Fc(d, f, g),
					j = 1 == b.text.length,
					k = Vd(b.text).length + (j ? e : 0);
					if (h)
						for (var l = 0; l < h.length; ++l) {
							var m = h[l];
							if (null == m.to) {
								var n = Bc(i, m.marker);
								n ? j && (m.to = null == n.to ? null : n.to + k) : m.to = e
							}
						}
					if (i)
						for (var l = 0; l < i.length; ++l) {
							var m = i[l];
							if (null != m.to && (m.to += k), null == m.from) {
								var n = Bc(h, m.marker);
								n || (m.from = k, j && (h || (h = [])).push(m))
							} else
								m.from += k, j && (h || (h = [])).push(m)
						}
					if (j && h) {
						for (var l = 0; l < h.length; ++l)
							null != h[l].from && h[l].from == h[l].to && "bookmark" != h[l].marker.type && h.splice(l--, 1);
						h.length || (h = null)
					}
					var o = [h];
					if (!j) {
						var p,
						q = b.text.length - 2;
						if (q > 0 && h)
							for (var l = 0; l < h.length; ++l)
								null == h[l].to && (p || (p = [])).push({
									from : null,
									to : null,
									marker : h[l].marker
								});
						for (var l = 0; q > l; ++l)
							o.push(p);
						o.push(i)
					}
					return o
				}
					function Hc(a, b) {
					var c = xd(a, b),
					d = Gc(a, b);
					if (!c)
						return d;
					if (!d)
						return c;
					for (var e = 0; e < c.length; ++e) {
						var f = c[e],
						g = d[e];
						if (f && g)
							a : for (var h = 0; h < g.length; ++h) {
								for (var i = g[h], j = 0; j < f.length; ++j)
									if (f[j].marker == i.marker)
										continue a;
								f.push(i)
							}
						else
							g && (c[e] = g)
					}
					return c
				}
					function Ic(a, b, c) {
					var d = null;
					if (a.iter(b.line, c.line + 1, function (a) {
							if (a.markedSpans)
								for (var b = 0; b < a.markedSpans.length; ++b) {
									var c = a.markedSpans[b].marker;
									!c.readOnly || d && -1 != Xd(d, c) || (d || (d = [])).push(c)
								}
						}), !d)
						return null;
					for (var e = [{
								from : b,
								to : c
							}
						], f = 0; f < d.length; ++f)
						for (var g = d[f], h = g.find(), i = 0; i < e.length; ++i) {
							var j = e[i];
							if (!Ub(j.to, h.from) && !Ub(h.to, j.from)) {
								var k = [i, 1];
								(Ub(j.from, h.from) || !g.inclusiveLeft && Tb(j.from, h.from)) && k.push({
									from : j.from,
									to : h.from
								}),
								(Ub(h.to, j.to) || !g.inclusiveRight && Tb(j.to, h.to)) && k.push({
									from : h.to,
									to : j.to
								}),
								e.splice.apply(e, k),
								i += k.length - 1
							}
						}
					return e
				}
					function Jc(a, b) {
					var c,
					d = Ue && a.markedSpans;
					if (d)
						for (var e, f = 0; f < d.length; ++f)
							e = d[f], e.marker.collapsed && (null == e.from || e.from < b) && (null == e.to || e.to > b) && (!c || c.width < e.marker.width) && (c = e.marker);
					return c
				}
					function Kc(a) {
					return Jc(a, -1)
				}
					function Lc(a) {
					return Jc(a, a.text.length + 1)
				}
					function Mc(a, b) {
					for (var c; c = Kc(b); )
						b = kd(a, c.find().from.line);
					return b
				}
					function Nc(a, b) {
					var c = Ue && b.markedSpans;
					if (c)
						for (var d, e = 0; e < c.length; ++e)
							if (d = c[e], d.marker.collapsed) {
								if (null == d.from)
									return !0;
								if (!d.marker.replacedWith && 0 == d.from && d.marker.inclusiveLeft && Oc(a, b, d))
									return !0
							}
				}
					function Oc(a, b, c) {
					if (null == c.to) {
						var d = c.marker.find().to,
						e = kd(a, d.line);
						return Oc(a, e, Bc(e.markedSpans, c.marker))
					}
					if (c.marker.inclusiveRight && c.to == b.text.length)
						return !0;
					for (var f, g = 0; g < b.markedSpans.length; ++g)
						if (f = b.markedSpans[g], f.marker.collapsed && !f.marker.replacedWith && f.from == c.to && (f.marker.inclusiveLeft || c.marker.inclusiveRight) && Oc(a, b, f))
							return !0
				}
					function Pc(a) {
					var b = a.markedSpans;
					if (b) {
						for (var c = 0; c < b.length; ++c)
							b[c].marker.detachLine(a);
						a.markedSpans = null
					}
				}
					function Qc(a, b) {
					if (b) {
						for (var c = 0; c < b.length; ++c)
							b[c].marker.attachLine(a);
						a.markedSpans = b
					}
				}
					function Rc(a) {
					return function () {
						var b = !this.cm.curOp;
						b && db(this.cm);
						try {
							var c = a.apply(this, arguments)
						}
						finally {
							b && eb(this.cm)
						}
						return c
					}
				}
					function Sc(a) {
					return null != a.height ? a.height : (a.node.parentNode && 1 == a.node.parentNode.nodeType || ee(a.cm.display.measure, ce("div", [a.node], null, "position: relative")), a.height = a.node.offsetHeight)
				}
					function Tc(a, b, c, d) {
					var e = new mf(a, c, d);
					return e.noHScroll && (a.display.alignWidgets = !0),
					kc(a, b, function (b) {
						var c = b.widgets || (b.widgets = []);
						if (null == e.insertAt ? c.push(e) : c.splice(Math.min(c.length - 1, Math.max(0, e.insertAt)), 0, e), e.line = b, !Nc(a.doc, b) || e.showIfHidden) {
							var d = qd(a, b) < a.doc.scrollTop;
							nd(b, b.height + Sc(e)),
							d && ic(a, 0, e.height)
						}
						return !0
					}),
					e
				}
					function Uc(a, b, c, d) {
					a.text = b,
					a.stateAfter && (a.stateAfter = null),
					a.styles && (a.styles = null),
					null != a.order && (a.order = null),
					Pc(a),
					Qc(a, c);
					var e = d ? d(a) : 1;
					e != a.height && nd(a, e)
				}
					function Vc(a) {
					a.parent = null,
					Pc(a)
				}
					function Wc(a, b, c, d, e) {
					var f = c.flattenSpans;
					null == f && (f = a.options.flattenSpans);
					var g,
					h = 0,
					i = null,
					j = new wc(b, a.options.tabSize);
					for ("" == b && c.blankLine && c.blankLine(d); !j.eol(); )
						j.pos > a.options.maxHighlightLength ? (f = !1, j.pos = Math.min(b.length, j.start + 5e4), g = null) : g = c.token(j, d), f && i == g || (h < j.start && e(j.start, i), h = j.start, i = g), j.start = j.pos;
					h < j.pos && e(j.pos, i)
				}
					function Xc(a, b, c) {
					var d = [a.state.modeGen];
					Wc(a, b.text, a.doc.mode, c, function (a, b) {
						d.push(a, b)
					});
					for (var e = 0; e < a.state.overlays.length; ++e) {
						var f = a.state.overlays[e],
						g = 1,
						h = 0;
						Wc(a, b.text, f.mode, !0, function (a, b) {
							for (var c = g; a > h; ) {
								var e = d[g];
								e > a && d.splice(g, 1, a, d[g + 1], e),
								g += 2,
								h = Math.min(a, e)
							}
							if (b)
								if (f.opaque)
									d.splice(c, g - c, a, b), g = c + 2;
								else
									for (; g > c; c += 2) {
										var i = d[c + 1];
										d[c + 1] = i ? i + " " + b : b
									}
						})
					}
					return d
				}
					function Yc(a, b) {
					return b.styles && b.styles[0] == a.state.modeGen || (b.styles = Xc(a, b, b.stateAfter = J(a, od(b)))),
					b.styles
				}
					function Zc(a, b, c) {
					var d = a.doc.mode,
					e = new wc(b.text, a.options.tabSize);
					for ("" == b.text && d.blankLine && d.blankLine(c); !e.eol() && e.pos <= a.options.maxHighlightLength; )
						d.token(e, c), e.start = e.pos
				}
					function $c(a) {
					return a ? of[a] || (of[a] = "cm-" + a.replace(/ +/g, " cm-")) : null
				}
					function _c(a, b, c, d) {
					for (var e, f = b, g = !0; e = Kc(f); )
						f = kd(a.doc, e.find().from.line);
					var h = {
						pre : ce("pre"),
						col : 0,
						pos : 0,
						measure : null,
						measuredSomething : !1,
						cm : a,
						copyWidgets : d
					};
					f.textClass && (h.pre.className = f.textClass);
					do {
						f.text && (g = !1),
						h.measure = f == b && c,
						h.pos = 0,
						h.addToken = h.measure ? bd : ad,
						(xe || Ae) && a.getOption("lineWrapping") && (h.addToken = cd(h.addToken));
						var i = ed(f, h, Yc(a, f));
						c && f == b && !h.measuredSomething && (c[0] = h.pre.appendChild(je(a.display.measure)), h.measuredSomething = !0),
						i && (f = kd(a.doc, i.to.line))
					} while (i);
					!c || h.measuredSomething || c[0] || (c[0] = h.pre.appendChild(g ? ce("span", " ") : je(a.display.measure))),
					h.pre.firstChild || Nc(a.doc, b) || h.pre.appendChild(document.createTextNode(" "));
					var j;
					if (c && xe && (j = rd(f))) {
						var k = j.length - 1;
						j[k].from == j[k].to && --k;
						var l = j[k],
						m = j[k - 1];
						if (l.from + 1 == l.to && m && l.level < m.level) {
							var n = c[h.pos - 1];
							n && n.parentNode.insertBefore(n.measureRight = je(a.display.measure), n.nextSibling)
						}
					}
					return Md(a, "renderLine", a, b, h.pre),
					h.pre
				}
					function ad(a, b, c, d, e, f) {
					if (b) {
						if (pf.test(b))
							for (var g = document.createDocumentFragment(), h = 0; ; ) {
								pf.lastIndex = h;
								var i = pf.exec(b),
								j = i ? i.index - h : b.length - h;
								if (j && (g.appendChild(document.createTextNode(b.slice(h, h + j))), a.col += j), !i)
									break;
								if (h += j + 1, "	" == i[0]) {
									var k = a.cm.options.tabSize,
									l = k - a.col % k;
									g.appendChild(ce("span", Ud(l), "cm-tab")),
									a.col += l
								} else {
									var m = ce("span", "•", "cm-invalidchar");
									m.title = "\\u" + i[0].charCodeAt(0).toString(16),
									g.appendChild(m),
									a.col += 1
								}
							}
						else {
							a.col += b.length;
							var g = document.createTextNode(b)
						}
						if (c || d || e || a.measure) {
							var n = c || "";
							d && (n += d),
							e && (n += e);
							var m = ce("span", [g], n);
							return f && (m.title = f),
							a.pre.appendChild(m)
						}
						a.pre.appendChild(g)
					}
				}
					function bd(a, b, c, d, e) {
					for (var f = a.cm.options.lineWrapping, g = 0; g < b.length; ++g) {
						var h = b.charAt(g),
						i = 0 == g;
						h >= "��" && "��" > h && g < b.length - 1 ? (h = b.slice(g, g + 2), ++g) : g && f && he(b, g) && a.pre.appendChild(ce("wbr"));
						var j = a.measure[a.pos],
						k = a.measure[a.pos] = ad(a, h, c, i && d, g == b.length - 1 && e);
						j && (k.leftSide = j.leftSide || j),
						xe && f && " " == h && g && !/\s/.test(b.charAt(g - 1)) && g < b.length - 1 && !/\s/.test(b.charAt(g + 1)) && (k.style.whiteSpace = "normal"),
						a.pos += h.length
					}
					b.length && (a.measuredSomething = !0)
				}
					function cd(a) {
					function b(a) {
						for (var b = " ", c = 0; c < a.length - 2; ++c)
							b += c % 2 ? " " : " ";
						return b += " "
					}
					return function (c, d, e, f, g, h) {
						return a(c, d.replace(/ {3,}/, b), e, f, g, h)
					}
				}
					function dd(a, b, c, d) {
					var e = !d && c.replacedWith;
					if (e && (a.copyWidgets && (e = e.cloneNode(!0)), a.pre.appendChild(e), a.measure)) {
						if (b)
							a.measure[a.pos] = e;
						else {
							var f = je(a.cm.display.measure);
							if ("bookmark" != c.type || c.insertLeft) {
								if (a.measure[a.pos])
									return;
								a.measure[a.pos] = a.pre.insertBefore(f, e)
							} else
								a.measure[a.pos] = a.pre.appendChild(f)
						}
						a.measuredSomething = !0
					}
					a.pos += b
				}
					function ed(a, b, c) {
					var d = a.markedSpans,
					e = a.text,
					f = 0;
					if (d)
						for (var g, h, i, j, k, l, m = e.length, n = 0, o = 1, p = "", q = 0; ; ) {
							if (q == n) {
								h = i = j = k = "",
								l = null,
								q = 1 / 0;
								for (var r = [], s = 0; s < d.length; ++s) {
									var t = d[s],
									u = t.marker;
									t.from <= n && (null == t.to || t.to > n) ? (null != t.to && q > t.to && (q = t.to, i = ""), u.className && (h += " " + u.className), u.startStyle && t.from == n && (j += " " + u.startStyle), u.endStyle && t.to == q && (i += " " + u.endStyle), u.title && !k && (k = u.title), u.collapsed && (!l || l.marker.size < u.size) && (l = t)) : t.from > n && q > t.from && (q = t.from),
									"bookmark" == u.type && t.from == n && u.replacedWith && r.push(u)
								}
								if (l && (l.from || 0) == n && (dd(b, (null == l.to ? m : l.to) - n, l.marker, null == l.from), null == l.to))
									return l.marker.find();
								if (!l && r.length)
									for (var s = 0; s < r.length; ++s)
										dd(b, 0, r[s])
							}
							if (n >= m)
								break;
							for (var v = Math.min(m, q); ; ) {
								if (p) {
									var w = n + p.length;
									if (!l) {
										var x = w > v ? p.slice(0, v - n) : p;
										b.addToken(b, x, g ? g + h : h, j, n + x.length == q ? i : "", k)
									}
									if (w >= v) {
										p = p.slice(v - n),
										n = v;
										break
									}
									n = w,
									j = ""
								}
								p = e.slice(f, f = c[o++]),
								g = $c(c[o++])
							}
						}
					else
						for (var o = 1; o < c.length; o += 2)
							b.addToken(b, e.slice(f, f = c[o]), $c(c[o + 1]))
				}
					function fd(a, b, c, d, e) {
					function f(a) {
						return c ? c[a] : null
					}
					function g(a, c, d) {
						Uc(a, c, d, e),
						Nd(a, "change", a, b)
					}
					var h = b.from,
					i = b.to,
					j = b.text,
					k = kd(a, h.line),
					l = kd(a, i.line),
					m = Vd(j),
					n = f(j.length - 1),
					o = i.line - h.line;
					if (0 == h.ch && 0 == i.ch && "" == m) {
						for (var p = 0, q = j.length - 1, r = []; q > p; ++p)
							r.push(new nf(j[p], f(p), e));
						g(l, l.text, n),
						o && a.remove(h.line, o),
						r.length && a.insert(h.line, r)
					} else if (k == l)
						if (1 == j.length)
							g(k, k.text.slice(0, h.ch) + m + k.text.slice(i.ch), n);
						else {
							for (var r = [], p = 1, q = j.length - 1; q > p; ++p)
								r.push(new nf(j[p], f(p), e));
							r.push(new nf(m + k.text.slice(i.ch), n, e)),
							g(k, k.text.slice(0, h.ch) + j[0], f(0)),
							a.insert(h.line + 1, r)
						}
					else if (1 == j.length)
						g(k, k.text.slice(0, h.ch) + j[0] + l.text.slice(i.ch), f(0)), a.remove(h.line + 1, o);
					else {
						g(k, k.text.slice(0, h.ch) + j[0], f(0)),
						g(l, m + l.text.slice(i.ch), n);
						for (var p = 1, q = j.length - 1, r = []; q > p; ++p)
							r.push(new nf(j[p], f(p), e));
						o > 1 && a.remove(h.line + 1, o - 1),
						a.insert(h.line + 1, r)
					}
					Nd(a, "change", a, b),
					ac(a, d.anchor, d.head, null, !0)
				}
					function gd(a) {
					this.lines = a,
					this.parent = null;
					for (var b = 0, c = a.length, d = 0; c > b; ++b)
						a[b].parent = this, d += a[b].height;
					this.height = d
				}
					function hd(a) {
					this.children = a;
					for (var b = 0, c = 0, d = 0, e = a.length; e > d; ++d) {
						var f = a[d];
						b += f.chunkSize(),
						c += f.height,
						f.parent = this
					}
					this.size = b,
					this.height = c,
					this.parent = null
				}
					function id(a, b, c) {
					function d(a, e, f) {
						if (a.linked)
							for (var g = 0; g < a.linked.length; ++g) {
								var h = a.linked[g];
								if (h.doc != e) {
									var i = f && h.sharedHist;
									(!c || i) && (b(h.doc, i), d(h.doc, a, i))
								}
							}
					}
					d(a, null, !0)
				}
					function jd(a, b) {
					if (b.cm)
						throw new Error("This document is already in use.");
					a.doc = b,
					b.cm = a,
					f(a),
					c(a),
					a.options.lineWrapping || l(a),
					a.options.mode = b.modeOption,
					ib(a)
				}
					function kd(a, b) {
					for (b -= a.first; !a.lines; )
						for (var c = 0; ; ++c) {
							var d = a.children[c],
							e = d.chunkSize();
							if (e > b) {
								a = d;
								break
							}
							b -= e
						}
					return a.lines[b]
				}
					function ld(a, b, c) {
					var d = [],
					e = b.line;
					return a.iter(b.line, c.line + 1, function (a) {
						var f = a.text;
						e == c.line && (f = f.slice(0, c.ch)),
						e == b.line && (f = f.slice(b.ch)),
						d.push(f),
						++e
					}),
					d
				}
					function md(a, b, c) {
					var d = [];
					return a.iter(b, c, function (a) {
						d.push(a.text)
					}),
					d
				}
					function nd(a, b) {
					for (var c = b - a.height, d = a; d; d = d.parent)
						d.height += c
				}
					function od(a) {
					if (null == a.parent)
						return null;
					for (var b = a.parent, c = Xd(b.lines, a), d = b.parent; d; b = d, d = d.parent)
						for (var e = 0; d.children[e] != b; ++e)
							c += d.children[e].chunkSize();
					return c + b.first
				}
					function pd(a, b) {
					var c = a.first;
					a : do {
						for (var d = 0, e = a.children.length; e > d; ++d) {
							var f = a.children[d],
							g = f.height;
							if (g > b) {
								a = f;
								continue a
							}
							b -= g,
							c += f.chunkSize()
						}
						return c
					} while (!a.lines);
					for (var d = 0, e = a.lines.length; e > d; ++d) {
						var h = a.lines[d],
						i = h.height;
						if (i > b)
							break;
						b -= i
					}
					return c + d
				}
					function qd(a, b) {
					b = Mc(a.doc, b);
					for (var c = 0, d = b.parent, e = 0; e < d.lines.length; ++e) {
						var f = d.lines[e];
						if (f == b)
							break;
						c += f.height
					}
					for (var g = d.parent; g; d = g, g = d.parent)
						for (var e = 0; e < g.children.length; ++e) {
							var h = g.children[e];
							if (h == d)
								break;
							c += h.height
						}
					return c
				}
					function rd(a) {
					var b = a.order;
					return null == b && (b = a.order = Jf(a.text)),
					b
				}
					function sd(a) {
					return {
						done : [],
						undone : [],
						undoDepth : 1 / 0,
						lastTime : 0,
						lastOp : null,
						lastOrigin : null,
						generation : a || 1,
						maxGeneration : a || 1
					}
				}
					function td(a, b, c, d) {
					var e = b["spans_" + a.id],
					f = 0;
					a.iter(Math.max(a.first, c), Math.min(a.first + a.size, d), function (c) {
						c.markedSpans && ((e || (e = b["spans_" + a.id] = {}))[f] = c.markedSpans),
						++f
					})
				}
					function ud(a, b) {
					var c = {
						line : b.from.line,
						ch : b.from.ch
					},
					d = {
						from : c,
						to : af(b),
						text : ld(a, b.from, b.to)
					};
					return td(a, d, b.from.line, b.to.line + 1),
					id(a, function (a) {
						td(a, d, b.from.line, b.to.line + 1)
					}, !0),
					d
				}
					function vd(a, b, c, d) {
					var e = a.history;
					e.undone.length = 0;
					var f = +new Date,
					g = Vd(e.done);
					if (g && (e.lastOp == d || e.lastOrigin == b.origin && b.origin && ("+" == b.origin.charAt(0) && a.cm && e.lastTime > f - a.cm.options.historyEventDelay || "*" == b.origin.charAt(0)))) {
						var h = Vd(g.changes);
						Tb(b.from, b.to) && Tb(b.from, h.to) ? h.to = af(b) : g.changes.push(ud(a, b)),
						g.anchorAfter = c.anchor,
						g.headAfter = c.head
					} else
						for (g = {
								changes : [ud(a, b)],
								generation : e.generation,
								anchorBefore : a.sel.anchor,
								headBefore : a.sel.head,
								anchorAfter : c.anchor,
								headAfter : c.head
							}, e.done.push(g), e.generation = ++e.maxGeneration; e.done.length > e.undoDepth; )
							e.done.shift();
					e.lastTime = f,
					e.lastOp = d,
					e.lastOrigin = b.origin
				}
					function wd(a) {
					if (!a)
						return null;
					for (var b, c = 0; c < a.length; ++c)
						a[c].marker.explicitlyCleared ? b || (b = a.slice(0, c)) : b && b.push(a[c]);
					return b ? b.length ? b : null : a
				}
					function xd(a, b) {
					var c = b["spans_" + a.id];
					if (!c)
						return null;
					for (var d = 0, e = []; d < b.text.length; ++d)
						e.push(wd(c[d]));
					return e
				}
					function yd(a, b) {
					for (var c = 0, d = []; c < a.length; ++c) {
						var e = a[c],
						f = e.changes,
						g = [];
						d.push({
							changes : g,
							anchorBefore : e.anchorBefore,
							headBefore : e.headBefore,
							anchorAfter : e.anchorAfter,
							headAfter : e.headAfter
						});
						for (var h = 0; h < f.length; ++h) {
							var i,
							j = f[h];
							if (g.push({
									from : j.from,
									to : j.to,
									text : j.text
								}), b)
								for (var k in j)
									(i = k.match(/^spans_(\d+)$/)) && Xd(b, Number(i[1])) > -1 && (Vd(g)[k] = j[k], delete j[k])
						}
					}
					return d
				}
					function zd(a, b, c, d) {
					c < a.line ? a.line += d : b < a.line && (a.line = b, a.ch = 0)
				}
					function Ad(a, b, c, d) {
					for (var e = 0; e < a.length; ++e) {
						for (var f = a[e], g = !0, h = 0; h < f.changes.length; ++h) {
							var i = f.changes[h];
							if (f.copied || (i.from = Vb(i.from), i.to = Vb(i.to)), c < i.from.line)
								i.from.line += d, i.to.line += d;
							else if (b <= i.to.line) {
								g = !1;
								break
							}
						}
						f.copied || (f.anchorBefore = Vb(f.anchorBefore), f.headBefore = Vb(f.headBefore), f.anchorAfter = Vb(f.anchorAfter), f.readAfter = Vb(f.headAfter), f.copied = !0),
						g ? (zd(f.anchorBefore), zd(f.headBefore), zd(f.anchorAfter), zd(f.headAfter)) : (a.splice(0, e + 1), e = 0)
					}
				}
					function Bd(a, b) {
					var c = b.from.line,
					d = b.to.line,
					e = b.text.length - (d - c) - 1;
					Ad(a.done, c, d, e),
					Ad(a.undone, c, d, e)
				}
					function Cd() {
					Hd(this)
				}
					function Dd(a) {
					return a.stop || (a.stop = Cd),
					a
				}
					function Ed(a) {
					a.preventDefault ? a.preventDefault() : a.returnValue = !1
				}
					function Fd(a) {
					a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
				}
					function Gd(a) {
					return null != a.defaultPrevented ? a.defaultPrevented : 0 == a.returnValue
				}
					function Hd(a) {
					Ed(a),
					Fd(a)
				}
					function Id(a) {
					return a.target || a.srcElement
				}
					function Jd(a) {
					var b = a.which;
					return null == b && (1 & a.button ? b = 1 : 2 & a.button ? b = 3 : 4 & a.button && (b = 2)),
					Le && a.ctrlKey && 1 == b && (b = 3),
					b
				}
					function Kd(a, b, c) {
					if (a.addEventListener)
						a.addEventListener(b, c, !1);
					else if (a.attachEvent)
						a.attachEvent("on" + b, c);
					else {
						var d = a._handlers || (a._handlers = {}),
						e = d[b] || (d[b] = []);
						e.push(c)
					}
				}
					function Ld(a, b, c) {
					if (a.removeEventListener)
						a.removeEventListener(b, c, !1);
					else if (a.detachEvent)
						a.detachEvent("on" + b, c);
					else {
						var d = a._handlers && a._handlers[b];
						if (!d)
							return;
						for (var e = 0; e < d.length; ++e)
							if (d[e] == c) {
								d.splice(e, 1);
								break
							}
					}
				}
					function Md(a, b) {
					var c = a._handlers && a._handlers[b];
					if (c)
						for (var d = Array.prototype.slice.call(arguments, 2), e = 0; e < c.length; ++e)
							c[e].apply(null, d)
				}
					function Nd(a, b) {
					function c(a) {
						return function () {
							a.apply(null, e)
						}
					}
					var d = a._handlers && a._handlers[b];
					if (d) {
						var e = Array.prototype.slice.call(arguments, 2);
						uf || (++vf, uf = [], setTimeout(Pd, 0));
						for (var f = 0; f < d.length; ++f)
							uf.push(c(d[f]))
					}
				}
					function Od(a, b, c) {
					return Md(a, c || b.type, a, b),
					Gd(b) || b.codemirrorIgnore
				}
					function Pd() {
					--vf;
					var a = uf;
					uf = null;
					for (var b = 0; b < a.length; ++b)
						a[b]()
				}
					function Qd(a, b) {
					var c = a._handlers && a._handlers[b];
					return c && c.length > 0
				}
					function Rd(a) {
					a.prototype.on = function (a, b) {
						Kd(this, a, b)
					},
					a.prototype.off = function (a, b) {
						Ld(this, a, b)
					}
				}
					function Sd() {
					this.id = null
				}
					function Td(a, b, c, d, e) {
					null == b && (b = a.search(/[^\s\u00a0]/), -1 == b && (b = a.length));
					for (var f = d || 0, g = e || 0; b > f; ++f)
						"	" == a.charAt(f) ? g += c - g % c : ++g;
					return g
				}
					function Ud(a) {
					for (; yf.length <= a; )
						yf.push(Vd(yf) + " ");
					return yf[a]
				}
					function Vd(a) {
					return a[a.length - 1]
				}
					function Wd(a) {
					if (Je)
						a.selectionStart = 0, a.selectionEnd = a.value.length;
					else
						try {
							a.select()
						} catch (b) {}

				}
					function Xd(a, b) {
					if (a.indexOf)
						return a.indexOf(b);
					for (var c = 0, d = a.length; d > c; ++c)
						if (a[c] == b)
							return c;
					return -1
				}
					function Yd(a, b) {
					function c() {}

					c.prototype = a;
					var d = new c;
					return b && Zd(b, d),
					d
				}
					function Zd(a, b) {
					b || (b = {});
					for (var c in a)
						a.hasOwnProperty(c) && (b[c] = a[c]);
					return b
				}
					function $d(a) {
					for (var b = [], c = 0; a > c; ++c)
						b.push(void 0);
					return b
				}
					function _d(a) {
					var b = Array.prototype.slice.call(arguments, 1);
					return function () {
						return a.apply(null, b)
					}
				}
					function ae(a) {
					return /\w/.test(a) || a > "" && (a.toUpperCase() != a.toLowerCase() || zf.test(a))
				}
					function be(a) {
					for (var b in a)
						if (a.hasOwnProperty(b) && a[b])
							return !1;
					return !0
				}
					function ce(a, b, c, d) {
					var e = document.createElement(a);
					if (c && (e.className = c), d && (e.style.cssText = d), "string" == typeof b)
						fe(e, b);
					else if (b)
						for (var f = 0; f < b.length; ++f)
							e.appendChild(b[f]);
					return e
				}
					function de(a) {
					for (var b = a.childNodes.length; b > 0; --b)
						a.removeChild(a.firstChild);
					return a
				}
					function ee(a, b) {
					return de(a).appendChild(b)
				}
					function fe(a, b) {
					ze ? (a.innerHTML = "", a.appendChild(document.createTextNode(b))) : a.textContent = b
				}
					function ge(a) {
					return a.getBoundingClientRect()
				}
					function he() {
					return !1
				}
					function ie(a) {
					if (null != Cf)
						return Cf;
					var b = ce("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");
					return ee(a, b),
					b.offsetWidth && (Cf = b.offsetHeight - b.clientHeight),
					Cf || 0
				}
					function je(a) {
					if (null == Df) {
						var b = ce("span", "​");
						ee(a, ce("span", [b, document.createTextNode("x")])),
						0 != a.firstChild.offsetHeight && (Df = b.offsetWidth <= 1 && b.offsetHeight > 2 && !ye)
					}
					return Df ? ce("span", "​") : ce("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px")
				}
					function ke(a, b, c, d) {
					if (!a)
						return d(b, c, "ltr");
					for (var e = !1, f = 0; f < a.length; ++f) {
						var g = a[f];
						(g.from < c && g.to > b || b == c && g.to == b) && (d(Math.max(g.from, b), Math.min(g.to, c), 1 == g.level ? "rtl" : "ltr"), e = !0)
					}
					e || d(b, c, "ltr")
				}
					function le(a) {
					return a.level % 2 ? a.to : a.from
				}
					function me(a) {
					return a.level % 2 ? a.from : a.to
				}
					function ne(a) {
					var b = rd(a);
					return b ? le(b[0]) : 0
				}
					function oe(a) {
					var b = rd(a);
					return b ? me(Vd(b)) : a.text.length
				}
					function pe(a, b) {
					var c = kd(a.doc, b),
					d = Mc(a.doc, c);
					d != c && (b = od(d));
					var e = rd(d),
					f = e ? e[0].level % 2 ? oe(d) : ne(d) : 0;
					return Sb(b, f)
				}
					function qe(a, b) {
					for (var c, d; c = Lc(d = kd(a.doc, b)); )
						b = c.find().to.line;
					var e = rd(d),
					f = e ? e[0].level % 2 ? ne(d) : oe(d) : d.text.length;
					return Sb(b, f)
				}
					function re(a, b, c) {
					var d = a[0].level;
					return b == d ? !0 : c == d ? !1 : c > b
				}
					function se(a, b) {
					for (var c, d = 0; d < a.length; ++d) {
						var e = a[d];
						if (e.from < b && e.to > b)
							return If = null, d;
						if (e.from == b || e.to == b) {
							if (null != c)
								return re(a, e.level, a[c].level) ? (If = c, d) : (If = d, c);
							c = d
						}
					}
					return If = null,
					c
				}
					function te(a, b, c, d) {
					if (!d)
						return b + c;
					do
						b += c;
					while (b > 0 && Af.test(a.text.charAt(b)));
					return b
				}
					function ue(a, b, c, d) {
					var e = rd(a);
					if (!e)
						return ve(a, b, c, d);
					for (var f = se(e, b), g = e[f], h = te(a, b, g.level % 2 ? -c : c, d); ; ) {
						if (h > g.from && h < g.to)
							return h;
						if (h == g.from || h == g.to)
							return se(e, h) == f ? h : (g = e[f += c], c > 0 == g.level % 2 ? g.to : g.from);
						if (g = e[f += c], !g)
							return null;
						h = c > 0 == g.level % 2 ? te(a, g.to, -1, d) : te(a, g.from, 1, d)
					}
				}
					function ve(a, b, c, d) {
					var e = b + c;
					if (d)
						for (; e > 0 && Af.test(a.text.charAt(e)); )
							e += c;
					return 0 > e || e > a.text.length ? null : e
				}
					var we = /gecko\/\d/i.test(navigator.userAgent), xe = /MSIE \d/.test(navigator.userAgent), ye = xe && (null == document.documentMode || document.documentMode < 8), ze = xe && (null == document.documentMode || document.documentMode < 9), Ae = /WebKit\//.test(navigator.userAgent), Be = Ae && /Qt\/\d+\.\d+/.test(navigator.userAgent), Ce = /Chrome\//.test(navigator.userAgent), De = /Opera\//.test(navigator.userAgent), Ee = /Apple Computer/.test(navigator.vendor), Fe = /KHTML\//.test(navigator.userAgent), Ge = /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent), He = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent), Ie = /PhantomJS/.test(navigator.userAgent), Je = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent), Ke = Je || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent), Le = Je || /Mac/.test(navigator.platform), Me = /win/i.test(navigator.platform), Ne = De && navigator.userAgent.match(/Version\/(\d*\.\d*)/); Ne && (Ne = Number(Ne[1])), Ne && Ne >= 15 && (De = !1, Ae = !0); var Oe, Pe, Qe, Re = Le && (Be || De && (null == Ne || 12.11 > Ne)), Se = we || xe && !ze, Te = !1, Ue = !1, Ve = 0, We = 0, Xe = 0, Ye = null; xe ? Ye =  - .53 : we ? Ye = 15 : Ce ? Ye =  - .7 : Ee && (Ye = -1 / 3); var Ze, $e, _e = null, af = a.changeEnd = function (a) {
					return a.text ? Sb(a.from.line + a.text.length - 1, Vd(a.text).length + (1 == a.text.length ? a.from.ch : 0)) : a.to
				}; a.Pos = Sb, a.prototype = {
						constructor : a,
						focus : function () {
							window.focus(),
							nb(this),
							Fb(this),
							kb(this)
						},
						setOption : function (a, b) {
							var c = this.options,
							d = c[a];
							(c[a] != b || "mode" == a) && (c[a] = b, bf.hasOwnProperty(a) && fb(this, bf[a])(this, b, d))
						},
						getOption : function (a) {
							return this.options[a]
						},
						getDoc : function () {
							return this.doc
						},
						addKeyMap : function (a, b) {
							this.state.keyMaps[b ? "push" : "unshift"](a)
						},
						removeKeyMap : function (a) {
							for (var b = this.state.keyMaps, c = 0; c < b.length; ++c)
								if (b[c] == a || "string" != typeof b[c] && b[c].name == a)
									return b.splice(c, 1), !0
						},
						addOverlay : fb(null, function (b, c) {
							var d = b.token ? b : a.getMode(this.options, b);
							if (d.startState)
								throw new Error("Overlays may not be stateful.");
							this.state.overlays.push({
								mode : d,
								modeSpec : b,
								opaque : c && c.opaque
							}),
							this.state.modeGen++,
							ib(this)
						}),
						removeOverlay : fb(null, function (a) {
							for (var b = this.state.overlays, c = 0; c < b.length; ++c) {
								var d = b[c].modeSpec;
								if (d == a || "string" == typeof a && d.name == a)
									return b.splice(c, 1), this.state.modeGen++, ib(this), void 0
							}
						}),
						indentLine : fb(null, function (a, b, c) {
							"string" != typeof b && "number" != typeof b && (b = null == b ? this.options.smartIndent ? "smart" : "prev" : b ? "add" : "subtract"),
							Zb(this.doc, a) && jc(this, a, b, c)
						}),
						indentSelection : fb(null, function (a) {
							var b = this.doc.sel;
							if (Tb(b.from, b.to))
								return jc(this, b.from.line, a);
							for (var c = b.to.line - (b.to.ch ? 0 : 1), d = b.from.line; c >= d; ++d)
								jc(this, d, a)
						}),
						getTokenAt : function (a, b) {
							var c = this.doc;
							a = Xb(c, a);
							for (var d = J(this, a.line, b), e = this.doc.mode, f = kd(c, a.line), g = new wc(f.text, this.options.tabSize); g.pos < a.ch && !g.eol(); ) {
								g.start = g.pos;
								var h = e.token(g, d)
							}
							return {
								start : g.start,
								end : g.pos,
								string : g.current(),
								className : h || null,
								type : h || null,
								state : d
							}
						},
						getTokenTypeAt : function (a) {
							a = Xb(this.doc, a);
							var b = Yc(this, kd(this.doc, a.line)),
							c = 0,
							d = (b.length - 1) / 2,
							e = a.ch;
							if (0 == e)
								return b[2];
							for (; ; ) {
								var f = c + d >> 1;
								if ((f ? b[2 * f - 1] : 0) >= e)
									d = f;
								else {
									if (!(b[2 * f + 1] < e))
										return b[2 * f + 2];
									c = f + 1
								}
							}
						},
						getModeAt : function (b) {
							var c = this.doc.mode;
							return c.innerMode ? a.innerMode(c, this.getTokenAt(b).state).mode : c
						},
						getHelper : function (a, b) {
							if (jf.hasOwnProperty(b)) {
								var c = jf[b],
								d = this.getModeAt(a);
								return d[b] && c[d[b]] || d.helperType && c[d.helperType] || c[d.name]
							}
						},
						getStateAfter : function (a, b) {
							var c = this.doc;
							return a = Wb(c, null == a ? c.first + c.size - 1 : a),
							J(this, a + 1, b)
						},
						cursorCoords : function (a, b) {
							var c,
							d = this.doc.sel;
							return c = null == a ? d.head : "object" == typeof a ? Xb(this.doc, a) : a ? d.from : d.to,
							Z(this, c, b || "page")
						},
						charCoords : function (a, b) {
							return Y(this, Xb(this.doc, a), b || "page")
						},
						coordsChar : function (a, b) {
							return a = X(this, a, b || "page"),
							_(this, a.left, a.top)
						},
						lineAtHeight : function (a, b) {
							return a = X(this, {
									top : a,
									left : 0
								}, b || "page").top,
							pd(this.doc, a + this.display.viewOffset)
						},
						heightAtLine : function (a, b) {
							var c = !1,
							d = this.doc.first + this.doc.size - 1;
							a < this.doc.first ? a = this.doc.first : a > d && (a = d, c = !0);
							var e = kd(this.doc, a);
							return W(this, kd(this.doc, a), {
								top : 0,
								left : 0
							}, b || "page").top + (c ? e.height : 0)
						},
						defaultTextHeight : function () {
							return bb(this.display)
						},
						defaultCharWidth : function () {
							return cb(this.display)
						},
						setGutterMarker : fb(null, function (a, b, c) {
							return kc(this, a, function (a) {
								var d = a.gutterMarkers || (a.gutterMarkers = {});
								return d[b] = c,
								!c && be(d) && (a.gutterMarkers = null),
								!0
							})
						}),
						clearGutter : fb(null, function (a) {
							var b = this,
							c = b.doc,
							d = c.first;
							c.iter(function (c) {
								c.gutterMarkers && c.gutterMarkers[a] && (c.gutterMarkers[a] = null, ib(b, d, d + 1), be(c.gutterMarkers) && (c.gutterMarkers = null)),
								++d
							})
						}),
						addLineClass : fb(null, function (a, b, c) {
							return kc(this, a, function (a) {
								var d = "text" == b ? "textClass" : "background" == b ? "bgClass" : "wrapClass";
								if (a[d]) {
									if (new RegExp("(?:^|\\s)" + c + "(?:$|\\s)").test(a[d]))
										return !1;
									a[d] += " " + c
								} else
									a[d] = c;
								return !0
							})
						}),
						removeLineClass : fb(null, function (a, b, c) {
							return kc(this, a, function (a) {
								var d = "text" == b ? "textClass" : "background" == b ? "bgClass" : "wrapClass",
								e = a[d];
								if (!e)
									return !1;
								if (null == c)
									a[d] = null;
								else {
									var f = e.match(new RegExp("(?:^|\\s+)" + c + "(?:$|\\s+)"));
									if (!f)
										return !1;
									var g = f.index + f[0].length;
									a[d] = e.slice(0, f.index) + (f.index && g != e.length ? " " : "") + e.slice(g) || null
								}
								return !0
							})
						}),
						addLineWidget : fb(null, function (a, b, c) {
							return Tc(this, a, b, c)
						}),
						removeLineWidget : function (a) {
							a.clear()
						},
						lineInfo : function (a) {
							if ("number" == typeof a) {
								if (!Zb(this.doc, a))
									return null;
								var b = a;
								if (a = kd(this.doc, a), !a)
									return null
							} else {
								var b = od(a);
								if (null == b)
									return null
							}
							return {
								line : b,
								handle : a,
								text : a.text,
								gutterMarkers : a.gutterMarkers,
								textClass : a.textClass,
								bgClass : a.bgClass,
								wrapClass : a.wrapClass,
								widgets : a.widgets
							}
						},
						getViewport : function () {
							return {
								from : this.display.showingFrom,
								to : this.display.showingTo
							}
						},
						addWidget : function (a, b, c, d, e) {
							var f = this.display;
							a = Z(this, Xb(this.doc, a));
							var g = a.bottom,
							h = a.left;
							if (b.style.position = "absolute", f.sizer.appendChild(b), "over" == d)
								g = a.top;
							else if ("above" == d || "near" == d) {
								var i = Math.max(f.wrapper.clientHeight, this.doc.height),
								j = Math.max(f.sizer.clientWidth, f.lineSpace.clientWidth);
								("above" == d || a.bottom + b.offsetHeight > i) && a.top > b.offsetHeight ? g = a.top - b.offsetHeight : a.bottom + b.offsetHeight <= i && (g = a.bottom),
								h + b.offsetWidth > j && (h = j - b.offsetWidth)
							}
							b.style.top = g + "px",
							b.style.left = b.style.right = "",
							"right" == e ? (h = f.sizer.clientWidth - b.offsetWidth, b.style.right = "0px") : ("left" == e ? h = 0 : "middle" == e && (h = (f.sizer.clientWidth - b.offsetWidth) / 2), b.style.left = h + "px"),
							c && fc(this, h, g, h + b.offsetWidth, g + b.offsetHeight)
						},
						triggerOnKeyDown : fb(null, Db),
						execCommand : function (a) {
							return kf[a](this)
						},
						findPosH : function (a, b, c, d) {
							var e = 1;
							0 > b && (e = -1, b = -b);
							for (var f = 0, g = Xb(this.doc, a); b > f && (g = lc(this.doc, g, e, c, d), !g.hitSide); ++f);
							return g
						},
						moveH : fb(null, function (a, b) {
							var c,
							d = this.doc.sel;
							c = d.shift || d.extend || Tb(d.from, d.to) ? lc(this.doc, d.head, a, b, this.options.rtlMoveVisually) : 0 > a ? d.from : d.to,
							$b(this.doc, c, c, a)
						}),
						deleteH : fb(null, function (a, b) {
							var c = this.doc.sel;
							Tb(c.from, c.to) ? Rb(this.doc, "", c.from, lc(this.doc, c.head, a, b, !1), "+delete") : Rb(this.doc, "", c.from, c.to, "+delete"),
							this.curOp.userSelChange = !0
						}),
						findPosV : function (a, b, c, d) {
							var e = 1,
							f = d;
							0 > b && (e = -1, b = -b);
							for (var g = 0, h = Xb(this.doc, a); b > g; ++g) {
								var i = Z(this, h, "div");
								if (null == f ? f = i.left : i.left = f, h = mc(this, i, e, c), h.hitSide)
									break
							}
							return h
						},
						moveV : fb(null, function (a, b) {
							var c = this.doc.sel,
							d = Z(this, c.head, "div");
							null != c.goalColumn && (d.left = c.goalColumn);
							var e = mc(this, d, a, b);
							"page" == b && ic(this, 0, Y(this, e, "div").top - d.top),
							$b(this.doc, e, e, a),
							c.goalColumn = d.left
						}),
						toggleOverwrite : function (a) {
							(null == a || a != this.state.overwrite) && ((this.state.overwrite = !this.state.overwrite) ? this.display.cursor.className += " CodeMirror-overwrite" : this.display.cursor.className = this.display.cursor.className.replace(" CodeMirror-overwrite", ""))
						},
						hasFocus : function () {
							return this.state.focused
						},
						scrollTo : fb(null, function (a, b) {
							hc(this, a, b)
						}),
						getScrollInfo : function () {
							var a = this.display.scroller,
							b = wf;
							return {
								left : a.scrollLeft,
								top : a.scrollTop,
								height : a.scrollHeight - b,
								width : a.scrollWidth - b,
								clientHeight : a.clientHeight - b,
								clientWidth : a.clientWidth - b
							}
						},
						scrollIntoView : fb(null, function (a, b) {
							"number" == typeof a && (a = Sb(a, 0)),
							b || (b = 0);
							var c = a;
							a && null == a.line || (this.curOp.scrollToPos = a ? Xb(this.doc, a) : this.doc.sel.head, this.curOp.scrollToPosMargin = b, c = Z(this, this.curOp.scrollToPos));
							var d = gc(this, c.left, c.top - b, c.right, c.bottom + b);
							hc(this, d.scrollLeft, d.scrollTop)
						}),
						setSize : fb(null, function (a, b) {
							function c(a) {
								return "number" == typeof a || /^\d+$/.test(String(a)) ? a + "px" : a
							}
							null != a && (this.display.wrapper.style.width = c(a)),
							null != b && (this.display.wrapper.style.height = c(b)),
							this.options.lineWrapping && (this.display.measureLineCache.length = this.display.measureLineCachePos = 0),
							this.curOp.forceUpdate = !0
						}),
						operation : function (a) {
							return hb(this, a)
						},
						refresh : fb(null, function () {
							T(this),
							hc(this, this.doc.scrollLeft, this.doc.scrollTop),
							ib(this)
						}),
						swapDoc : fb(null, function (a) {
							var b = this.doc;
							return b.cm = null,
							jd(this, a),
							T(this),
							mb(this, !0),
							hc(this, a.scrollLeft, a.scrollTop),
							b
						}),
						getInputField : function () {
							return this.display.input
						},
						getWrapperElement : function () {
							return this.display.wrapper
						},
						getScrollerElement : function () {
							return this.display.scroller
						},
						getGutterElement : function () {
							return this.display.gutters
						}
					}, Rd(a); var bf = a.optionHandlers = {}, cf = a.defaults = {}, df = a.Init = {
						toString : function () {
							return "CodeMirror.Init"
						}
					}; pc("value", "", function (a, b) {
						a.setValue(b)
					}, !0), pc("mode", null, function (a, b) {
						a.doc.modeOption = b,
						c(a)
					}, !0), pc("indentUnit", 2, c, !0), pc("indentWithTabs", !1), pc("smartIndent", !0), pc("tabSize", 4, function (a) {
						c(a),
						T(a),
						ib(a)
					}, !0), pc("electricChars", !0), pc("rtlMoveVisually", !Me), pc("theme", "default", function (a) {
						h(a),
						i(a)
					}, !0), pc("keyMap", "default", g), pc("extraKeys", null), pc("onKeyEvent", null), pc("onDragEvent", null), pc("lineWrapping", !1, d, !0), pc("gutters", [], function (a) {
						m(a.options),
						i(a)
					}, !0), pc("fixedGutter", !0, function (a, b) {
						a.display.gutters.style.left = b ? s(a.display) + "px" : "0",
						a.refresh()
					}, !0), pc("coverGutterNextToScrollbar", !1, n, !0), pc("lineNumbers", !1, function (a) {
						m(a.options),
						i(a)
					}, !0), pc("firstLineNumber", 1, i, !0), pc("lineNumberFormatter", function (a) {
						return a
					}, i, !0), pc("showCursorWhenSelecting", !1, C, !0), pc("readOnly", !1, function (a, b) {
						"nocursor" == b ? (Gb(a), a.display.input.blur()) : b || mb(a, !0)
					}), pc("dragDrop", !0), pc("cursorBlinkRate", 530), pc("cursorScrollMargin", 0), pc("cursorHeight", 1), pc("workTime", 100), pc("workDelay", 100), pc("flattenSpans", !0), pc("pollInterval", 100), pc("undoDepth", 40, function (a, b) {
						a.doc.history.undoDepth = b
					}), pc("historyEventDelay", 500), pc("viewportMargin", 10, function (a) {
						a.refresh()
					}, !0), pc("maxHighlightLength", 1e4, function (a) {
						c(a),
						a.refresh()
					}, !0), pc("moveInputWithCursor", !0, function (a, b) {
						b || (a.display.inputDiv.style.top = a.display.inputDiv.style.left = 0)
					}), pc("tabindex", null, function (a, b) {
						a.display.input.tabIndex = b || ""
					}), pc("autofocus", null); var ef = a.modes = {}, ff = a.mimeModes = {}; a.defineMode = function (b, c) {
					if (a.defaults.mode || "null" == b || (a.defaults.mode = b), arguments.length > 2) {
						c.dependencies = [];
						for (var d = 2; d < arguments.length; ++d)
							c.dependencies.push(arguments[d])
					}
					ef[b] = c
				}, a.defineMIME = function (a, b) {
					ff[a] = b
				}, a.resolveMode = function (b) {
					if ("string" == typeof b && ff.hasOwnProperty(b))
						b = ff[b];
					else if (b && "string" == typeof b.name && ff.hasOwnProperty(b.name)) {
						var c = ff[b.name];
						b = Yd(c, b),
						b.name = c.name
					} else if ("string" == typeof b && /^[\w\-]+\/[\w\-]+\+xml$/.test(b))
						return a.resolveMode("application/xml");
					return "string" == typeof b ? {
						name : b
					}
					 : b || {
						name : "null"
					}
				}, a.getMode = function (b, c) {
					var c = a.resolveMode(c),
					d = ef[c.name];
					if (!d)
						return a.getMode(b, "text/plain");
					var e = d(b, c);
					if (gf.hasOwnProperty(c.name)) {
						var f = gf[c.name];
						for (var g in f)
							f.hasOwnProperty(g) && (e.hasOwnProperty(g) && (e["_" + g] = e[g]), e[g] = f[g])
					}
					return e.name = c.name,
					e
				}, a.defineMode("null", function () {
						return {
							token : function (a) {
								a.skipToEnd()
							}
						}
					}), a.defineMIME("text/plain", "null"); var gf = a.modeExtensions = {}; a.extendMode = function (a, b) {
					var c = gf.hasOwnProperty(a) ? gf[a] : gf[a] = {};
					Zd(b, c)
				}, a.defineExtension = function (b, c) {
					a.prototype[b] = c
				}, a.defineDocExtension = function (a, b) {
					rf.prototype[a] = b
				}, a.defineOption = pc; var hf = []; a.defineInitHook = function (a) {
					hf.push(a)
				}; var jf = a.helpers = {}; a.registerHelper = function (b, c, d) {
					jf.hasOwnProperty(b) || (jf[b] = a[b] = {}),
					jf[b][c] = d
				}, a.isWordChar = ae, a.copyState = qc, a.startState = rc, a.innerMode = function (a, b) {
					for (; a.innerMode; ) {
						var c = a.innerMode(b);
						if (!c || c.mode == a)
							break;
						b = c.state,
						a = c.mode
					}
					return c || {
						mode : a,
						state : b
					}
				}; var kf = a.commands = {
						selectAll : function (a) {
							a.setSelection(Sb(a.firstLine(), 0), Sb(a.lastLine()))
						},
						killLine : function (a) {
							var b = a.getCursor(!0),
							c = a.getCursor(!1),
							d = !Tb(b, c);
							d || a.getLine(b.line).length != b.ch ? a.replaceRange("", b, d ? c : Sb(b.line), "+delete") : a.replaceRange("", b, Sb(b.line + 1, 0), "+delete")
						},
						deleteLine : function (a) {
							var b = a.getCursor().line;
							a.replaceRange("", Sb(b, 0), Sb(b), "+delete")
						},
						delLineLeft : function (a) {
							var b = a.getCursor();
							a.replaceRange("", Sb(b.line, 0), b, "+delete")
						},
						undo : function (a) {
							a.undo()
						},
						redo : function (a) {
							a.redo()
						},
						goDocStart : function (a) {
							a.extendSelection(Sb(a.firstLine(), 0))
						},
						goDocEnd : function (a) {
							a.extendSelection(Sb(a.lastLine()))
						},
						goLineStart : function (a) {
							a.extendSelection(pe(a, a.getCursor().line))
						},
						goLineStartSmart : function (a) {
							var b = a.getCursor(),
							c = pe(a, b.line),
							d = a.getLineHandle(c.line),
							e = rd(d);
							if (e && 0 != e[0].level)
								a.extendSelection(c);
							else {
								var f = Math.max(0, d.text.search(/\S/)),
								g = b.line == c.line && b.ch <= f && b.ch;
								a.extendSelection(Sb(c.line, g ? 0 : f))
							}
						},
						goLineEnd : function (a) {
							a.extendSelection(qe(a, a.getCursor().line))
						},
						goLineRight : function (a) {
							var b = a.charCoords(a.getCursor(), "div").top + 5;
							a.extendSelection(a.coordsChar({
									left : a.display.lineDiv.offsetWidth + 100,
									top : b
								}, "div"))
						},
						goLineLeft : function (a) {
							var b = a.charCoords(a.getCursor(), "div").top + 5;
							a.extendSelection(a.coordsChar({
									left : 0,
									top : b
								}, "div"))
						},
						goLineUp : function (a) {
							a.moveV(-1, "line")
						},
						goLineDown : function (a) {
							a.moveV(1, "line")
						},
						goPageUp : function (a) {
							a.moveV(-1, "page")
						},
						goPageDown : function (a) {
							a.moveV(1, "page")
						},
						goCharLeft : function (a) {
							a.moveH(-1, "char")
						},
						goCharRight : function (a) {
							a.moveH(1, "char")
						},
						goColumnLeft : function (a) {
							a.moveH(-1, "column")
						},
						goColumnRight : function (a) {
							a.moveH(1, "column")
						},
						goWordLeft : function (a) {
							a.moveH(-1, "word")
						},
						goGroupRight : function (a) {
							a.moveH(1, "group")
						},
						goGroupLeft : function (a) {
							a.moveH(-1, "group")
						},
						goWordRight : function (a) {
							a.moveH(1, "word")
						},
						delCharBefore : function (a) {
							a.deleteH(-1, "char")
						},
						delCharAfter : function (a) {
							a.deleteH(1, "char")
						},
						delWordBefore : function (a) {
							a.deleteH(-1, "word")
						},
						delWordAfter : function (a) {
							a.deleteH(1, "word")
						},
						delGroupBefore : function (a) {
							a.deleteH(-1, "group")
						},
						delGroupAfter : function (a) {
							a.deleteH(1, "group")
						},
						indentAuto : function (a) {
							a.indentSelection("smart")
						},
						indentMore : function (a) {
							a.indentSelection("add")
						},
						indentLess : function (a) {
							a.indentSelection("subtract")
						},
						insertTab : function (a) {
							a.replaceSelection("	", "end", "+input")
						},
						defaultTab : function (a) {
							a.somethingSelected() ? a.indentSelection("add") : a.replaceSelection("	", "end", "+input")
						},
						transposeChars : function (a) {
							var b = a.getCursor(),
							c = a.getLine(b.line);
							b.ch > 0 && b.ch < c.length - 1 && a.replaceRange(c.charAt(b.ch) + c.charAt(b.ch - 1), Sb(b.line, b.ch - 1), Sb(b.line, b.ch + 1))
						},
						newlineAndIndent : function (a) {
							fb(a, function () {
								a.replaceSelection("\n", "end", "+input"),
								a.indentLine(a.getCursor().line, null, !0)
							})()
						},
						toggleOverwrite : function (a) {
							a.toggleOverwrite()
						}
					}, lf = a.keyMap = {}; lf.basic = {
						Left : "goCharLeft",
						Right : "goCharRight",
						Up : "goLineUp",
						Down : "goLineDown",
						End : "goLineEnd",
						Home : "goLineStartSmart",
						PageUp : "goPageUp",
						PageDown : "goPageDown",
						Delete : "delCharAfter",
						Backspace : "delCharBefore",
						Tab : "defaultTab",
						"Shift-Tab" : "indentAuto",
						Enter : "newlineAndIndent",
						Insert : "toggleOverwrite"
					}, lf.pcDefault = {
						"Ctrl-A" : "selectAll",
						"Ctrl-D" : "deleteLine",
						"Ctrl-Z" : "undo",
						"Shift-Ctrl-Z" : "redo",
						"Ctrl-Y" : "redo",
						"Ctrl-Home" : "goDocStart",
						"Alt-Up" : "goDocStart",
						"Ctrl-End" : "goDocEnd",
						"Ctrl-Down" : "goDocEnd",
						"Ctrl-Left" : "goGroupLeft",
						"Ctrl-Right" : "goGroupRight",
						"Alt-Left" : "goLineStart",
						"Alt-Right" : "goLineEnd",
						"Ctrl-Backspace" : "delGroupBefore",
						"Ctrl-Delete" : "delGroupAfter",
						"Ctrl-S" : "save",
						"Ctrl-F" : "find",
						"Ctrl-G" : "findNext",
						"Shift-Ctrl-G" : "findPrev",
						"Shift-Ctrl-F" : "replace",
						"Shift-Ctrl-R" : "replaceAll",
						"Ctrl-[" : "indentLess",
						"Ctrl-]" : "indentMore",
						fallthrough : "basic"
					}, lf.macDefault = {
						"Cmd-A" : "selectAll",
						"Cmd-D" : "deleteLine",
						"Cmd-Z" : "undo",
						"Shift-Cmd-Z" : "redo",
						"Cmd-Y" : "redo",
						"Cmd-Up" : "goDocStart",
						"Cmd-End" : "goDocEnd",
						"Cmd-Down" : "goDocEnd",
						"Alt-Left" : "goGroupLeft",
						"Alt-Right" : "goGroupRight",
						"Cmd-Left" : "goLineStart",
						"Cmd-Right" : "goLineEnd",
						"Alt-Backspace" : "delGroupBefore",
						"Ctrl-Alt-Backspace" : "delGroupAfter",
						"Alt-Delete" : "delGroupAfter",
						"Cmd-S" : "save",
						"Cmd-F" : "find",
						"Cmd-G" : "findNext",
						"Shift-Cmd-G" : "findPrev",
						"Cmd-Alt-F" : "replace",
						"Shift-Cmd-Alt-F" : "replaceAll",
						"Cmd-[" : "indentLess",
						"Cmd-]" : "indentMore",
						"Cmd-Backspace" : "delLineLeft",
						fallthrough : ["basic", "emacsy"]
					}, lf["default"] = Le ? lf.macDefault : lf.pcDefault, lf.emacsy = {
						"Ctrl-F" : "goCharRight",
						"Ctrl-B" : "goCharLeft",
						"Ctrl-P" : "goLineUp",
						"Ctrl-N" : "goLineDown",
						"Alt-F" : "goWordRight",
						"Alt-B" : "goWordLeft",
						"Ctrl-A" : "goLineStart",
						"Ctrl-E" : "goLineEnd",
						"Ctrl-V" : "goPageDown",
						"Shift-Ctrl-V" : "goPageUp",
						"Ctrl-D" : "delCharAfter",
						"Ctrl-H" : "delCharBefore",
						"Alt-D" : "delWordAfter",
						"Alt-Backspace" : "delWordBefore",
						"Ctrl-K" : "killLine",
						"Ctrl-T" : "transposeChars"
					}, a.lookupKey = tc, a.isModifierKey = uc, a.keyName = vc, a.fromTextArea = function (b, c) {
					function d() {
						b.value = j.getValue()
					}
					if (c || (c = {}), c.value = b.value, !c.tabindex && b.tabindex && (c.tabindex = b.tabindex), !c.placeholder && b.placeholder && (c.placeholder = b.placeholder), null == c.autofocus) {
						var e = document.body;
						try {
							e = document.activeElement
						} catch (f) {}

						c.autofocus = e == b || null != b.getAttribute("autofocus") && e == document.body
					}
					if (b.form && (Kd(b.form, "submit", d), !c.leaveSubmitMethodAlone)) {
						var g = b.form,
						h = g.submit;
						try {
							var i = g.submit = function () {
								d(),
								g.submit = h,
								g.submit(),
								g.submit = i
							}
						} catch (f) {}

					}
					b.style.display = "none";
					var j = a(function (a) {
							b.parentNode.insertBefore(a, b.nextSibling)
						}, c);
					return j.save = d,
					j.getTextArea = function () {
						return b
					},
					j.toTextArea = function () {
						d(),
						b.parentNode.removeChild(j.getWrapperElement()),
						b.style.display = "",
						b.form && (Ld(b.form, "submit", d), "function" == typeof b.form.submit && (b.form.submit = h))
					},
					j
				}, wc.prototype = {
						eol : function () {
							return this.pos >= this.string.length
						},
						sol : function () {
							return 0 == this.pos
						},
						peek : function () {
							return this.string.charAt(this.pos) || void 0
						},
						next : function () {
							return this.pos < this.string.length ? this.string.charAt(this.pos++) : void 0
						},
						eat : function (a) {
							var b = this.string.charAt(this.pos);
							if ("string" == typeof a)
								var c = b == a;
							else
								var c = b && (a.test ? a.test(b) : a(b));
							return c ? (++this.pos, b) : void 0
						},
						eatWhile : function (a) {
							for (var b = this.pos; this.eat(a); );
							return this.pos > b
						},
						eatSpace : function () {
							for (var a = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos)); )
								++this.pos;
							return this.pos > a
						},
						skipToEnd : function () {
							this.pos = this.string.length
						},
						skipTo : function (a) {
							var b = this.string.indexOf(a, this.pos);
							return b > -1 ? (this.pos = b, !0) : void 0
						},
						backUp : function (a) {
							this.pos -= a
						},
						column : function () {
							return this.lastColumnPos < this.start && (this.lastColumnValue = Td(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start),
							this.lastColumnValue
						},
						indentation : function () {
							return Td(this.string, null, this.tabSize)
						},
						match : function (a, b, c) {
							if ("string" != typeof a) {
								var d = this.string.slice(this.pos).match(a);
								return d && d.index > 0 ? null : (d && b !== !1 && (this.pos += d[0].length), d)
							}
							var e = function (a) {
								return c ? a.toLowerCase() : a
							},
							f = this.string.substr(this.pos, a.length);
							return e(f) == e(a) ? (b !== !1 && (this.pos += a.length), !0) : void 0
						},
						current : function () {
							return this.string.slice(this.start, this.pos)
						}
					}, a.StringStream = wc, a.TextMarker = xc, Rd(xc), xc.prototype.clear = function () {
					if (!this.explicitlyCleared) {
						var a = this.doc.cm,
						b = a && !a.curOp;
						if (b && db(a), Qd(this, "clear")) {
							var c = this.find();
							c && Nd(this, "clear", c.from, c.to)
						}
						for (var d = null, e = null, f = 0; f < this.lines.length; ++f) {
							var g = this.lines[f],
							h = Bc(g.markedSpans, this);
							null != h.to && (e = od(g)),
							g.markedSpans = Cc(g.markedSpans, h),
							null != h.from ? d = od(g) : this.collapsed && !Nc(this.doc, g) && a && nd(g, bb(a.display))
						}
						if (a && this.collapsed && !a.options.lineWrapping)
							for (var f = 0; f < this.lines.length; ++f) {
								var i = Mc(a.doc, this.lines[f]),
								j = k(a.doc, i);
								j > a.display.maxLineLength && (a.display.maxLine = i, a.display.maxLineLength = j, a.display.maxLineChanged = !0)
							}
						null != d && a && ib(a, d, e + 1),
						this.lines.length = 0,
						this.explicitlyCleared = !0,
						this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, a && bc(a)),
						b && eb(a)
					}
				}, xc.prototype.find = function () {
					for (var a, b, c = 0; c < this.lines.length; ++c) {
						var d = this.lines[c],
						e = Bc(d.markedSpans, this);
						if (null != e.from || null != e.to) {
							var f = od(d);
							null != e.from && (a = Sb(f, e.from)),
							null != e.to && (b = Sb(f, e.to))
						}
					}
					return "bookmark" == this.type ? a : a && {
						from : a,
						to : b
					}
				}, xc.prototype.changed = function () {
					var a = this.find(),
					b = this.doc.cm;
					if (a && b) {
						"bookmark" != this.type && (a = a.from);
						var c = kd(this.doc, a.line);
						if (P(b, c), a.line >= b.display.showingFrom && a.line < b.display.showingTo) {
							for (var d = b.display.lineDiv.firstChild; d; d = d.nextSibling)
								if (d.lineObj == c) {
									d.offsetHeight != c.height && nd(c, d.offsetHeight);
									break
								}
							hb(b, function () {
								b.curOp.selectionChanged = b.curOp.forceUpdate = b.curOp.updateMaxLine = !0
							})
						}
					}
				}, xc.prototype.attachLine = function (a) {
					if (!this.lines.length && this.doc.cm) {
						var b = this.doc.cm.curOp;
						b.maybeHiddenMarkers && -1 != Xd(b.maybeHiddenMarkers, this) || (b.maybeUnhiddenMarkers || (b.maybeUnhiddenMarkers = [])).push(this)
					}
					this.lines.push(a)
				}, xc.prototype.detachLine = function (a) {
					if (this.lines.splice(Xd(this.lines, a), 1), !this.lines.length && this.doc.cm) {
						var b = this.doc.cm.curOp;
						(b.maybeHiddenMarkers || (b.maybeHiddenMarkers = [])).push(this)
					}
				}, a.SharedTextMarker = zc, Rd(zc), zc.prototype.clear = function () {
					if (!this.explicitlyCleared) {
						this.explicitlyCleared = !0;
						for (var a = 0; a < this.markers.length; ++a)
							this.markers[a].clear();
						Nd(this, "clear")
					}
				}, zc.prototype.find = function () {
					return this.primary.find()
				}; var mf = a.LineWidget = function (a, b, c) {
					if (c)
						for (var d in c)
							c.hasOwnProperty(d) && (this[d] = c[d]);
					this.cm = a,
					this.node = b
				}; Rd(mf), mf.prototype.clear = Rc(function () {
							var a = this.line.widgets,
							b = od(this.line);
							if (null != b && a) {
								for (var c = 0; c < a.length; ++c)
									a[c] == this && a.splice(c--, 1);
								a.length || (this.line.widgets = null);
								var d = qd(this.cm, this.line) < this.cm.doc.scrollTop;
								nd(this.line, Math.max(0, this.line.height - Sc(this))),
								d && ic(this.cm, 0, -this.height),
								ib(this.cm, b, b + 1)
							}
						}), mf.prototype.changed = Rc(function () {
							var a = this.height;
							this.height = null;
							var b = Sc(this) - a;
							if (b) {
								nd(this.line, this.line.height + b);
								var c = od(this.line);
								ib(this.cm, c, c + 1)
							}
						}); var nf = a.Line = function (a, b, c) {
					this.text = a,
					Qc(this, b),
					this.height = c ? c(this) : 1
				}; Rd(nf); var of = {}, pf = /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\uFEFF]/g; gd.prototype = {
						chunkSize : function () {
							return this.lines.length
						},
						removeInner : function (a, b) {
							for (var c = a, d = a + b; d > c; ++c) {
								var e = this.lines[c];
								this.height -= e.height,
								Vc(e),
								Nd(e, "delete")
							}
							this.lines.splice(a, b)
						},
						collapse : function (a) {
							a.splice.apply(a, [a.length, 0].concat(this.lines))
						},
						insertInner : function (a, b, c) {
							this.height += c,
							this.lines = this.lines.slice(0, a).concat(b).concat(this.lines.slice(a));
							for (var d = 0, e = b.length; e > d; ++d)
								b[d].parent = this
						},
						iterN : function (a, b, c) {
							for (var d = a + b; d > a; ++a)
								if (c(this.lines[a]))
									return !0
						}
					}, hd.prototype = {
						chunkSize : function () {
							return this.size
						},
						removeInner : function (a, b) {
							this.size -= b;
							for (var c = 0; c < this.children.length; ++c) {
								var d = this.children[c],
								e = d.chunkSize();
								if (e > a) {
									var f = Math.min(b, e - a),
									g = d.height;
									if (d.removeInner(a, f), this.height -= g - d.height, e == f && (this.children.splice(c--, 1), d.parent = null), 0 == (b -= f))
										break;
									a = 0
								} else
									a -= e
							}
							if (this.size - b < 25) {
								var h = [];
								this.collapse(h),
								this.children = [new gd(h)],
								this.children[0].parent = this
							}
						},
						collapse : function (a) {
							for (var b = 0, c = this.children.length; c > b; ++b)
								this.children[b].collapse(a)
						},
						insertInner : function (a, b, c) {
							this.size += b.length,
							this.height += c;
							for (var d = 0, e = this.children.length; e > d; ++d) {
								var f = this.children[d],
								g = f.chunkSize();
								if (g >= a) {
									if (f.insertInner(a, b, c), f.lines && f.lines.length > 50) {
										for (; f.lines.length > 50; ) {
											var h = f.lines.splice(f.lines.length - 25, 25),
											i = new gd(h);
											f.height -= i.height,
											this.children.splice(d + 1, 0, i),
											i.parent = this
										}
										this.maybeSpill()
									}
									break
								}
								a -= g
							}
						},
						maybeSpill : function () {
							if (!(this.children.length <= 10)) {
								var a = this;
								do {
									var b = a.children.splice(a.children.length - 5, 5),
									c = new hd(b);
									if (a.parent) {
										a.size -= c.size,
										a.height -= c.height;
										var d = Xd(a.parent.children, a);
										a.parent.children.splice(d + 1, 0, c)
									} else {
										var e = new hd(a.children);
										e.parent = a,
										a.children = [e, c],
										a = e
									}
									c.parent = a.parent
								} while (a.children.length > 10);
								a.parent.maybeSpill()
							}
						},
						iterN : function (a, b, c) {
							for (var d = 0, e = this.children.length; e > d; ++d) {
								var f = this.children[d],
								g = f.chunkSize();
								if (g > a) {
									var h = Math.min(b, g - a);
									if (f.iterN(a, h, c))
										return !0;
									if (0 == (b -= h))
										break;
									a = 0
								} else
									a -= g
							}
						}
					}; var qf = 0, rf = a.Doc = function (a, b, c) {
					if (!(this instanceof rf))
						return new rf(a, b, c);
					null == c && (c = 0),
					hd.call(this, [new gd([new nf("", null)])]),
					this.first = c,
					this.scrollTop = this.scrollLeft = 0,
					this.cantEdit = !1,
					this.history = sd(),
					this.cleanGeneration = 1,
					this.frontier = c;
					var d = Sb(c, 0);
					this.sel = {
						from : d,
						to : d,
						head : d,
						anchor : d,
						shift : !1,
						extend : !1,
						goalColumn : null
					},
					this.id = ++qf,
					this.modeOption = b,
					"string" == typeof a && (a = Ef(a)),
					fd(this, {
						from : d,
						to : d,
						text : a
					}, null, {
						head : d,
						anchor : d
					})
				}; rf.prototype = Yd(hd.prototype, {
							constructor : rf,
							iter : function (a, b, c) {
								c ? this.iterN(a - this.first, b - a, c) : this.iterN(this.first, this.first + this.size, a)
							},
							insert : function (a, b) {
								for (var c = 0, d = 0, e = b.length; e > d; ++d)
									c += b[d].height;
								this.insertInner(a - this.first, b, c)
							},
							remove : function (a, b) {
								this.removeInner(a - this.first, b)
							},
							getValue : function (a) {
								var b = md(this, this.first, this.first + this.size);
								return a === !1 ? b : b.join(a || "\n")
							},
							setValue : function (a) {
								var b = Sb(this.first, 0),
								c = this.first + this.size - 1;
								Lb(this, {
									from : b,
									to : Sb(c, kd(this, c).text.length),
									text : Ef(a),
									origin : "setValue"
								}, {
									head : b,
									anchor : b
								}, !0)
							},
							replaceRange : function (a, b, c, d) {
								b = Xb(this, b),
								c = c ? Xb(this, c) : b,
								Rb(this, a, b, c, d)
							},
							getRange : function (a, b, c) {
								var d = ld(this, Xb(this, a), Xb(this, b));
								return c === !1 ? d : d.join(c || "\n")
							},
							getLine : function (a) {
								var b = this.getLineHandle(a);
								return b && b.text
							},
							setLine : function (a, b) {
								Zb(this, a) && Rb(this, b, Sb(a, 0), Xb(this, Sb(a)))
							},
							removeLine : function (a) {
								a ? Rb(this, "", Xb(this, Sb(a - 1)), Xb(this, Sb(a))) : Rb(this, "", Sb(0, 0), Xb(this, Sb(1, 0)))
							},
							getLineHandle : function (a) {
								return Zb(this, a) ? kd(this, a) : void 0
							},
							getLineNumber : function (a) {
								return od(a)
							},
							getLineHandleVisualStart : function (a) {
								return "number" == typeof a && (a = kd(this, a)),
								Mc(this, a)
							},
							lineCount : function () {
								return this.size
							},
							firstLine : function () {
								return this.first
							},
							lastLine : function () {
								return this.first + this.size - 1
							},
							clipPos : function (a) {
								return Xb(this, a)
							},
							getCursor : function (a) {
								var b,
								c = this.sel;
								return b = null == a || "head" == a ? c.head : "anchor" == a ? c.anchor : "end" == a || a === !1 ? c.to : c.from,
								Vb(b)
							},
							somethingSelected : function () {
								return !Tb(this.sel.head, this.sel.anchor)
							},
							setCursor : gb(function (a, b, c) {
								var d = Xb(this, "number" == typeof a ? Sb(a, b || 0) : a);
								c ? $b(this, d) : ac(this, d, d)
							}),
							setSelection : gb(function (a, b, c) {
								ac(this, Xb(this, a), Xb(this, b || a), c)
							}),
							extendSelection : gb(function (a, b, c) {
								$b(this, Xb(this, a), b && Xb(this, b), c)
							}),
							getSelection : function (a) {
								return this.getRange(this.sel.from, this.sel.to, a)
							},
							replaceSelection : function (a, b, c) {
								Lb(this, {
									from : this.sel.from,
									to : this.sel.to,
									text : Ef(a),
									origin : c
								}, b || "around")
							},
							undo : gb(function () {
								Nb(this, "undo")
							}),
							redo : gb(function () {
								Nb(this, "redo")
							}),
							setExtending : function (a) {
								this.sel.extend = a
							},
							historySize : function () {
								var a = this.history;
								return {
									undo : a.done.length,
									redo : a.undone.length
								}
							},
							clearHistory : function () {
								this.history = sd(this.history.maxGeneration)
							},
							markClean : function () {
								this.cleanGeneration = this.changeGeneration()
							},
							changeGeneration : function () {
								return this.history.lastOp = this.history.lastOrigin = null,
								this.history.generation
							},
							isClean : function (a) {
								return this.history.generation == (a || this.cleanGeneration)
							},
							getHistory : function () {
								return {
									done : yd(this.history.done),
									undone : yd(this.history.undone)
								}
							},
							setHistory : function (a) {
								var b = this.history = sd(this.history.maxGeneration);
								b.done = a.done.slice(0),
								b.undone = a.undone.slice(0)
							},
							markText : function (a, b, c) {
								return yc(this, Xb(this, a), Xb(this, b), c, "range")
							},
							setBookmark : function (a, b) {
								var c = {
									replacedWith : b && (null == b.nodeType ? b.widget : b),
									insertLeft : b && b.insertLeft
								};
								return a = Xb(this, a),
								yc(this, a, a, c, "bookmark")
							},
							findMarksAt : function (a) {
								a = Xb(this, a);
								var b = [],
								c = kd(this, a.line).markedSpans;
								if (c)
									for (var d = 0; d < c.length; ++d) {
										var e = c[d];
										(null == e.from || e.from <= a.ch) && (null == e.to || e.to >= a.ch) && b.push(e.marker.parent || e.marker)
									}
								return b
							},
							getAllMarks : function () {
								var a = [];
								return this.iter(function (b) {
									var c = b.markedSpans;
									if (c)
										for (var d = 0; d < c.length; ++d)
											null != c[d].from && a.push(c[d].marker)
								}),
								a
							},
							posFromIndex : function (a) {
								var b,
								c = this.first;
								return this.iter(function (d) {
									var e = d.text.length + 1;
									return e > a ? (b = a, !0) : (a -= e, ++c, void 0)
								}),
								Xb(this, Sb(c, b))
							},
							indexFromPos : function (a) {
								a = Xb(this, a);
								var b = a.ch;
								return a.line < this.first || a.ch < 0 ? 0 : (this.iter(this.first, a.line, function (a) {
										b += a.text.length + 1
									}), b)
							},
							copy : function (a) {
								var b = new rf(md(this, this.first, this.first + this.size), this.modeOption, this.first);
								return b.scrollTop = this.scrollTop,
								b.scrollLeft = this.scrollLeft,
								b.sel = {
									from : this.sel.from,
									to : this.sel.to,
									head : this.sel.head,
									anchor : this.sel.anchor,
									shift : this.sel.shift,
									extend : !1,
									goalColumn : this.sel.goalColumn
								},
								a && (b.history.undoDepth = this.history.undoDepth, b.setHistory(this.getHistory())),
								b
							},
							linkedDoc : function (a) {
								a || (a = {});
								var b = this.first,
								c = this.first + this.size;
								null != a.from && a.from > b && (b = a.from),
								null != a.to && a.to < c && (c = a.to);
								var d = new rf(md(this, b, c), a.mode || this.modeOption, b);
								return a.sharedHist && (d.history = this.history),
								(this.linked || (this.linked = [])).push({
									doc : d,
									sharedHist : a.sharedHist
								}),
								d.linked = [{
										doc : this,
										isParent : !0,
										sharedHist : a.sharedHist
									}
								],
								d
							},
							unlinkDoc : function (b) {
								if (b instanceof a && (b = b.doc), this.linked)
									for (var c = 0; c < this.linked.length; ++c) {
										var d = this.linked[c];
										if (d.doc == b) {
											this.linked.splice(c, 1),
											b.unlinkDoc(this);
											break
										}
									}
								if (b.history == this.history) {
									var e = [b.id];
									id(b, function (a) {
										e.push(a.id)
									}, !0),
									b.history = sd(),
									b.history.done = yd(this.history.done, e),
									b.history.undone = yd(this.history.undone, e)
								}
							},
							iterLinkedDocs : function (a) {
								id(this, a)
							},
							getMode : function () {
								return this.mode
							},
							getEditor : function () {
								return this.cm
							}
						}), rf.prototype.eachLine = rf.prototype.iter; var sf = "iter insert remove copy getEditor".split(" "); for (var tf in rf.prototype)
						rf.prototype.hasOwnProperty(tf) && Xd(sf, tf) < 0 && (a.prototype[tf] = function (a) {
							return function () {
								return a.apply(this.doc, arguments)
							}
						}
							(rf.prototype[tf])); Rd(rf), a.e_stop = Hd, a.e_preventDefault = Ed, a.e_stopPropagation = Fd; var uf, vf = 0; a.on = Kd, a.off = Ld, a.signal = Md; var wf = 30, xf = a.Pass = {
						toString : function () {
							return "CodeMirror.Pass"
						}
					}; Sd.prototype = {
						set : function (a, b) {
							clearTimeout(this.id),
							this.id = setTimeout(b, a)
						}
					}, a.countColumn = Td; var yf = [""], zf = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/, Af = /[\u0300-\u036F\u0483-\u0487\u0488-\u0489\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\uA66F\uA670-\uA672\uA674-\uA67D\uA69F\udc00-\udfff]/; a.replaceGetRect = function (a) {
					ge = a
				}; var Bf = function () {
					if (ze)
						return !1;
					var a = ce("div");
					return "draggable" in a || "dragDrop" in a
				}
					(); we ? he = function (a, b) {
					return 36 == a.charCodeAt(b - 1) && 39 == a.charCodeAt(b)
				}
					 : Ee && !/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent) ? he = function (a, b) {
					return /\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(a.slice(b - 1, b + 1))
				}
					 : Ae && !/Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent) && (he = function (a, b) {
						if (b > 1 && 45 == a.charCodeAt(b - 1)) {
							if (/\w/.test(a.charAt(b - 2)) && /[^\-?\.]/.test(a.charAt(b)))
								return !0;
							if (b > 2 && /[\d\.,]/.test(a.charAt(b - 2)) && /[\d\.,]/.test(a.charAt(b)))
								return !1
						}
						return /[~!#%&*)=+}\]|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|…[\w~`@#$%\^&*(_=+{[><]/.test(a.slice(b - 1, b + 1))
					}); var Cf, Df, Ef = 3 != "\n\nb".split(/\n/).length ? function (a) {
					for (var b = 0, c = [], d = a.length; d >= b; ) {
						var e = a.indexOf("\n", b);
						-1 == e && (e = a.length);
						var f = a.slice(b, "\r" == a.charAt(e - 1) ? e - 1 : e),
						g = f.indexOf("\r");
						-1 != g ? (c.push(f.slice(0, g)), b += g + 1) : (c.push(f), b = e + 1)
					}
					return c
				}
					 : function (a) {
					return a.split(/\r\n?|\n/)
				}; a.splitLines = Ef; var Ff = window.getSelection ? function (a) {
					try {
						return a.selectionStart != a.selectionEnd
					} catch (b) {
						return !1
					}
				}
					 : function (a) {
					try {
						var b = a.ownerDocument.selection.createRange()
					} catch (c) {}

					return b && b.parentElement() == a ? 0 != b.compareEndPoints("StartToEnd", b) : !1
				}, Gf = function () {
					var a = ce("div");
					return "oncopy" in a ? !0 : (a.setAttribute("oncopy", "return;"), "function" == typeof a.oncopy)
				}
					(), Hf = {
						3 : "Enter",
						8 : "Backspace",
						9 : "Tab",
						13 : "Enter",
						16 : "Shift",
						17 : "Ctrl",
						18 : "Alt",
						19 : "Pause",
						20 : "CapsLock",
						27 : "Esc",
						32 : "Space",
						33 : "PageUp",
						34 : "PageDown",
						35 : "End",
						36 : "Home",
						37 : "Left",
						38 : "Up",
						39 : "Right",
						40 : "Down",
						44 : "PrintScrn",
						45 : "Insert",
						46 : "Delete",
						59 : ";",
						91 : "Mod",
						92 : "Mod",
						93 : "Mod",
						109 : "-",
						107 : "=",
						127 : "Delete",
						186 : ";",
						187 : "=",
						188 : ",",
						189 : "-",
						190 : ".",
						191 : "/",
						192 : "`",
						219 : "[",
						220 : "\\",
						221 : "]",
						222 : "'",
						63276 : "PageUp",
						63277 : "PageDown",
						63275 : "End",
						63273 : "Home",
						63234 : "Left",
						63232 : "Up",
						63235 : "Right",
						63233 : "Down",
						63302 : "Insert",
						63272 : "Delete"
					}; a.keyNames = Hf, function () {
					for (var a = 0; 10 > a; a++)
						Hf[a + 48] = String(a);
					for (var a = 65; 90 >= a; a++)
						Hf[a] = String.fromCharCode(a);
					for (var a = 1; 12 >= a; a++)
						Hf[a + 111] = Hf[a + 63235] = "F" + a
				}
					(); var If, Jf = function () {
					function a(a) {
						return 255 >= a ? b.charAt(a) : a >= 1424 && 1524 >= a ? "R" : a >= 1536 && 1791 >= a ? c.charAt(a - 1536) : a >= 1792 && 2220 >= a ? "r" : "L"
					}
					var b = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL",
					c = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr",
					d = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
					e = /[stwN]/,
					f = /[LRr]/,
					g = /[Lb1n]/,
					h = /[1n]/,
					i = "L";
					return function (b) {
						if (!d.test(b))
							return !1;
						for (var c, j = b.length, k = [], l = 0; j > l; ++l)
							k.push(c = a(b.charCodeAt(l)));
						for (var l = 0, m = i; j > l; ++l) {
							var c = k[l];
							"m" == c ? k[l] = m : m = c
						}
						for (var l = 0, n = i; j > l; ++l) {
							var c = k[l];
							"1" == c && "r" == n ? k[l] = "n" : f.test(c) && (n = c, "r" == c && (k[l] = "R"))
						}
						for (var l = 1, m = k[0]; j - 1 > l; ++l) {
							var c = k[l];
							"+" == c && "1" == m && "1" == k[l + 1] ? k[l] = "1" : "," != c || m != k[l + 1] || "1" != m && "n" != m || (k[l] = m),
							m = c
						}
						for (var l = 0; j > l; ++l) {
							var c = k[l];
							if ("," == c)
								k[l] = "N";
							else if ("%" == c) {
								for (var o = l + 1; j > o && "%" == k[o]; ++o);
								for (var p = l && "!" == k[l - 1] || j - 1 > o && "1" == k[o] ? "1" : "N", q = l; o > q; ++q)
									k[q] = p;
								l = o - 1
							}
						}
						for (var l = 0, n = i; j > l; ++l) {
							var c = k[l];
							"L" == n && "1" == c ? k[l] = "L" : f.test(c) && (n = c)
						}
						for (var l = 0; j > l; ++l)
							if (e.test(k[l])) {
								for (var o = l + 1; j > o && e.test(k[o]); ++o);
								for (var r = "L" == (l ? k[l - 1] : i), s = "L" == (j - 1 > o ? k[o] : i), p = r || s ? "L" : "R", q = l; o > q; ++q)
									k[q] = p;
								l = o - 1
							}
						for (var t, u = [], l = 0; j > l; )
							if (g.test(k[l])) {
								var v = l;
								for (++l; j > l && g.test(k[l]); ++l);
								u.push({
									from : v,
									to : l,
									level : 0
								})
							} else {
								var w = l,
								x = u.length;
								for (++l; j > l && "L" != k[l]; ++l);
								for (var q = w; l > q; )
									if (h.test(k[q])) {
										q > w && u.splice(x, 0, {
											from : w,
											to : q,
											level : 1
										});
										var y = q;
										for (++q; l > q && h.test(k[q]); ++q);
										u.splice(x, 0, {
											from : y,
											to : q,
											level : 2
										}),
										w = q
									} else ++q;
								l > w && u.splice(x, 0, {
									from : w,
									to : l,
									level : 1
								})
							}
						return 1 == u[0].level && (t = b.match(/^\s+/)) && (u[0].from = t[0].length, u.unshift({
								from : 0,
								to : t[0].length,
								level : 0
							})),
						1 == Vd(u).level && (t = b.match(/\s+$/)) && (Vd(u).to -= t[0].length, u.push({
								from : j - t[0].length,
								to : j,
								level : 0
							})),
						u[0].level != Vd(u).level && u.push({
							from : j,
							to : j,
							level : u[0].level
						}),
						u
					}
				}
					(); return a.version = "3.16.0", a
				}
					(), define("codemirror/codemirror", ["css!../components/codemirror/codemirror.css"], function (a) {
						return function () {
							var b;
							return b || a.CodeMirror
						}
					}
						(this)), define("tantaman/web/widgets/CodeEditor", ["libs/backbone", "codemirror/codemirror"], function (a, b) {
						return a.View.extend({
							className : "CodeEditor modal hide",
							events : {
								"click .ok" : "saveCode",
								"click .cancel" : "hide",
								hidden : "_hidden"
							},
							initialize : function () {
								this.template = JST["tantaman.web.widgets/CodeEditor"]
							},
							saveCode : function () {
								var a = this.mirror.getValue();
								this._saveCb(a)
							},
							show : function (a, c) {
								this._saveCb = a,
								this.$el.modal("show"),
								this.mirror || (this.mirror = b.fromTextArea(this.$input[0], {
											mode : this.options.mode
										})),
								c && this.mirror.setValue(c)
							},
							hide : function () {
								this.$el.modal("hide")
							},
							_hidden : function () {
								this.$input.val("")
							},
							render : function () {
								return this.$el.html(this.template(this.options)),
								this.$el.addClass(this.options.class),
								this.$input = this.$el.find(".codeInput"),
								this.$el.modal({
									show : !1
								}),
								this
							},
							constructor : function () {
								a.View.prototype.constructor.apply(this, arguments)
							}
						})
					}), define("tantaman/web/widgets/Button", ["libs/backbone"], function (a) {
						"use strict";
						return a.View.extend({
							className : "btn btn-plast",
							tagName : "a",
							events : {
								click : "_clicked"
							},
							initialize : function () {},
							_clicked : function () {
								this._disabled || this.options.cb()
							},
							render : function () {
								return this.$el.html('<i class="' + this.options.icon + ' icon-white"></i>' + this.options.name),
								this
							},
							disable : function () {
								this.$el.addClass("disabled"),
								this._disabled = !0
							},
							enable : function () {
								this._disabled = !1,
								this.$el.removeClass("disabled")
							},
							constructor : function () {
								a.View.prototype.constructor.apply(this, arguments)
							}
						})
					}), define("tantaman/web/css_manip/CssManip", [], function () {
						var a = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;
						return {
							createStyleElem : function (a) {
								var b = document.createElement("style");
								return b.type = "text/css",
								a.id && (b.id = a.id),
								b
							},
							getStyleElem : function (a) {
								var b = document.getElementById(a.id);
								return !b && a.create && (b = this.createStyleElem(a), this.appendStyleElem(b)),
								b
							},
							appendStyleElem : function (a) {
								document.getElementsByTagName("head")[0].appendChild(a)
							},
							extractClasses : function (b) {
								for (var c = b.rules || b.cssRules, d = {}, e = 0; e < c.length; ++e) {
									var f = c[e],
									g = f.selectorText.match(a);
									if (g)
										for (var h = 0; h < g.length; ++h) {
											var i = g[h].substring(1);
											d[i] = !0
										}
								}
								return d
							}
						}
					}), function (a, b) {
					"use strict";
					function c(a) {
						var b = Object.keys(a),
						c = [];
						return b.forEach(function (b) {
							if ("^" == b[0])
								throw "rules with ^ as their first character are currently unsupported.";
							var d = {
								regex : new RegExp("^(" + b + ")"),
								action : a[b]
							};
							c.push(d)
						}),
						c
					}
					function d(a, b) {
						a || (a = {}),
						b || (b = {});
						var c = b.initial;
						if (c)
							for (var d in a)
								c[d] = a[d];
						else
							b.initial = a;
						return b
					}
					function e(a, b, f) {
						"string" == typeof a && (a = new e.StringStream(a)),
						this._stream = a,
						this._currString = "",
						this._state = "initial",
						b = d(b, f),
						this._rules = {};
						for (var g in b)
							this._rules[g] = c(b[g])
					}
					e.EOF = {
						toString : function () {
							return "eof"
						}
					},
					e.IGNORE = {
						toString : function () {
							return "ignored"
						}
					},
					e.NO_MATCH = {
						msg : "NO SUITABLE CONTINUOUS MATCH"
					},
					e.StringStream = function (a) {
						this._string = a
					},
					e.StringStream.prototype = {
						nextString : function () {
							var a = this._string;
							return this._string = b,
							a
						}
					},
					e.prototype = {
						lex : function () {
							var a = this._getInput();
							if (!(a || "" != this._currString && this._currString))
								return e.EOF;
							this._currString += a;
							for (var b, c, d = this._rules[this._state]; !b; ) {
								for (var f = 0; f < d.length; ++f) {
									var g = d[f],
									h = g.regex.exec(this._currString);
									h && (!b || h[0].length > b[0].length) && (b = h, c = f)
								}
								if (!b) {
									var a = this._getInput(!0);
									if (!a)
										throw e.NO_MATCH;
									this._currString += a
								}
							}
							this._currString = this._currString.substring(b[0].length);
							var g = d[c];
							if ("function" == typeof g.action) {
								var i = g.action(b[0], this);
								return i === e.IGNORE ? this.lex() : i
							}
							return g.action === e.IGNORE ? this.lex() : g.action
						},
						_getInput : function (a) {
							return !this._currString || "" == this._currString || a ? this._stream.nextString() : ""
						},
						state : function (a) {
							return a ? (this._state = a, void 0) : this._state
						}
					},
					"function" == typeof define ? define("lexed", [], function () {
						return e
					}) : a.Lexed = e
				}
					(this), define("strut/themes/StylesheetPreProcessor", ["lexed"], function (a) {
						var b = {
							initial : {
								"/\\*" : function (a, b) {
									return b.state("comment"),
									a
								},
								"@[^\\n{]+" : function (a) {
									return a
								},
								"\\s+" : function (a) {
									return a
								},
								"{" : function (a, b) {
									return b.state("ruleDefinition"),
									a
								},
								"," : function (a) {
									return a
								},
								"[^{\\s\\/,@]+" : function (a, b) {
									return b.state("ruleName"), {
										text : a
									}
								}
							},
							ruleName : {
								"{" : function (a, b) {
									return b.state("ruleDefinition"),
									a
								},
								"," : function (a, b) {
									return b.state("initial"),
									a
								},
								"[^{,]+" : function (a) {
									return a
								}
							},
							comment : {
								"\\*/" : function (a, b) {
									return b.state("initial"),
									a
								},
								"\\*" : function (a) {
									return a
								},
								"[^*]" : function (a) {
									return a
								}
							},
							ruleDefinition : {
								"/\\*" : function (a, b) {
									return b.state("comment"),
									a
								},
								"{" : function (a, b) {
									return console.log("inner rule"),
									b.state("innerRule"),
									a
								},
								"[^{}]" : function (a) {
									return a
								},
								"}" : function (a, b) {
									return console.log("initial"),
									b.state("initial"),
									a
								}
							},
							innerRule : {
								"/\\*" : function (a, b) {
									return b.state("comment"),
									a
								},
								"[^}]" : function (a) {
									return a
								},
								"}" : function (a, b) {
									return b.state("ruleDefinition"),
									a
								}
							}
						};
						return {
							beforeSave : function (c) {
								for (var d = "", e = new a(c, null, b); (token = e.lex()) != a.EOF; )
									d += token.text ? ".slideContainer " + token.text : token;
								return d
							},
							beforeEdit : function (a) {
								return a ? a.replace(/.slideContainer /g, "") : ""
							}
						}
					}), CodeMirror.defineMode("css", function (a, b) {
						"use strict";
						function c(a, b) {
							return o = b,
							a
						}
						function d(a, b) {
							var d = a.next();
							if (h[d]) {
								var g = h[d](a, b);
								if (g !== !1)
									return g
							}
							if ("@" == d)
								return a.eatWhile(/[\w\\\-]/), c("def", a.current());
							if ("=" == d)
								c(null, "compare");
							else {
								if (("~" == d || "|" == d) && a.eat("="))
									return c(null, "compare");
								if ('"' == d || "'" == d)
									return b.tokenize = e(d), b.tokenize(a, b);
								if ("#" == d)
									return a.eatWhile(/[\w\\\-]/), c("atom", "hash");
								if ("!" == d)
									return a.match(/^\s*\w*/), c("keyword", "important");
								if (/\d/.test(d))
									return a.eatWhile(/[\w.%]/), c("number", "unit");
								if ("-" !== d)
									return /[,+>*\/]/.test(d) ? c(null, "select-op") : "." == d && a.match(/^-?[_a-z][_a-z0-9-]*/i) ? c("qualifier", "qualifier") : ":" == d ? c("operator", d) : /[;{}\[\]\(\)]/.test(d) ? c(null, d) : "u" == d && a.match("rl(") ? (a.backUp(1), b.tokenize = f, c("property", "variable")) : (a.eatWhile(/[\w\\\-]/), c("property", "variable"));
								if (/\d/.test(a.peek()))
									return a.eatWhile(/[\w.%]/), c("number", "unit");
								if (a.match(/^[^-]+-/))
									return c("meta", "meta")
							}
						}
						function e(a, b) {
							return function (e, f) {
								for (var g, h = !1; null != (g = e.next()) && (g != a || h); )
									h = !h && "\\" == g;
								return h || (b && e.backUp(1), f.tokenize = d),
								c("string", "string")
							}
						}
						function f(a, b) {
							return a.next(),
							b.tokenize = a.match(/\s*[\"\']/, !1) ? d : e(")", !0),
							c(null, "(")
						}
						b.propertyKeywords || (b = CodeMirror.resolveMode("text/css"));
						var g = a.indentUnit,
						h = b.hooks || {},
						i = b.atMediaTypes || {},
						j = b.atMediaFeatures || {},
						k = b.propertyKeywords || {},
						l = b.colorKeywords || {},
						m = b.valueKeywords || {},
						n = !!b.allowNested,
						o = null;
						return {
							startState : function (a) {
								return {
									tokenize : d,
									baseIndent : a || 0,
									stack : [],
									lastToken : null
								}
							},
							token : function (a, b) {
								if (b.tokenize = b.tokenize || d, b.tokenize == d && a.eatSpace())
									return null;
								var e = b.tokenize(a, b);
								e && "string" != typeof e && (e = c(e[0], e[1]));
								var f = b.stack[b.stack.length - 1];
								if ("variable" == e)
									return "variable-definition" == o && b.stack.push("propertyValue"), b.lastToken = "variable-2";
								if ("property" == e) {
									var g = a.current().toLowerCase();
									"propertyValue" == f ? e = m.hasOwnProperty(g) ? "string-2" : l.hasOwnProperty(g) ? "keyword" : "variable-2" : "rule" == f ? k.hasOwnProperty(g) || (e += " error") : "block" == f ? e = k.hasOwnProperty(g) ? "property" : l.hasOwnProperty(g) ? "keyword" : m.hasOwnProperty(g) ? "string-2" : "tag" : f && "@media{" != f ? "@media" == f ? e = i[a.current()] ? "attribute" : /^(only|not)$/.test(g) ? "keyword" : "and" == g ? "error" : j.hasOwnProperty(g) ? "error" : "attribute error" : "@mediaType" == f ? e = i.hasOwnProperty(g) ? "attribute" : "and" == g ? "operator" : /^(only|not)$/.test(g) ? "error" : "error" : "@mediaType(" == f ? k.hasOwnProperty(g) || (i.hasOwnProperty(g) ? e = "error" : "and" == g ? e = "operator" : /^(only|not)$/.test(g) ? e = "error" : e += " error") : e = "@import" == f ? "tag" : "error" : e = "tag"
								} else
									"atom" == e ? f && "@media{" != f && "block" != f ? "propertyValue" == f ? /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(a.current()) || (e += " error") : e = "error" : e = "builtin" : "@media" == f && "{" == o && (e = "error");
								if ("{" == o)
									if ("@media" == f || "@mediaType" == f)
										b.stack[b.stack.length - 1] = "@media{";
									else {
										var h = n ? "block" : "rule";
										b.stack.push(h)
									}
								else
									"}" == o ? ("interpolation" == f && (e = "operator"), b.stack.pop(), "propertyValue" == f && b.stack.pop()) : "interpolation" == o ? b.stack.push("interpolation") : "@media" == o ? b.stack.push("@media") : "@import" == o ? b.stack.push("@import") : "@media" == f && /\b(keyword|attribute)\b/.test(e) ? b.stack[b.stack.length - 1] = "@mediaType" : "@mediaType" == f && "," == a.current() ? b.stack[b.stack.length - 1] = "@media" : "(" == o ? "@media" == f || "@mediaType" == f ? (b.stack[b.stack.length - 1] = "@mediaType", b.stack.push("@mediaType(")) : b.stack.push("(") : ")" == o ? ("propertyValue" == f && b.stack.pop(), b.stack.pop()) : ":" == o && "property" == b.lastToken ? b.stack.push("propertyValue") : "propertyValue" == f && ";" == o ? b.stack.pop() : "@import" == f && ";" == o && b.stack.pop();
								return b.lastToken = e
							},
							indent : function (a, b) {
								var c = a.stack.length;
								return /^\}/.test(b) && (c -= "propertyValue" == a.stack[c - 1] ? 2 : 1),
								a.baseIndent + c * g
							},
							electricChars : "}",
							blockCommentStart : "/*",
							blockCommentEnd : "*/",
							fold : "brace"
						}
					}), function () {
					function a(a) {
						for (var b = {}, c = 0; c < a.length; ++c)
							b[a[c]] = !0;
						return b
					}
					function b(a, b) {
						for (var c, d = !1; null != (c = a.next()); ) {
							if (d && "/" == c) {
								b.tokenize = null;
								break
							}
							d = "*" == c
						}
						return ["comment", "comment"]
					}
					var c = a(["all", "aural", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "embossed"]),
					d = a(["width", "min-width", "max-width", "height", "min-height", "max-height", "device-width", "min-device-width", "max-device-width", "device-height", "min-device-height", "max-device-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio", "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "min-monochrome", "max-monochrome", "resolution", "min-resolution", "max-resolution", "scan", "grid"]),
					e = a(["align-content", "align-items", "align-self", "alignment-adjust", "alignment-baseline", "anchor-point", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "azimuth", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "baseline-shift", "binding", "bleed", "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "color", "color-profile", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings", "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-weight", "grid-cell", "grid-column", "grid-column-align", "grid-column-sizing", "grid-column-span", "grid-columns", "grid-flow", "grid-row", "grid-row-align", "grid-row-sizing", "grid-row-span", "grid-rows", "grid-template", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "inline-box-align", "justify-content", "left", "letter-spacing", "line-break", "line-height", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marker-offset", "marks", "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed", "marquee-style", "max-height", "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "page-policy", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pitch", "pitch-range", "play-during", "position", "presentation-level", "punctuation-trim", "quotes", "region-break-after", "region-break-before", "region-break-inside", "region-fragment", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness", "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "shape-inside", "shape-outside", "size", "speak", "speak-as", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size", "table-layout", "target", "target-name", "target-new", "target-position", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-height", "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow", "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position", "text-wrap", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "volume", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index", "zoom", "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color", "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering", "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "kerning", "text-anchor", "writing-mode"]),
					f = a(["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"]),
					g = a(["above", "absolute", "activeborder", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "button", "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "column", "compact", "condensed", "contain", "content", "content-box", "context-menu", "continuous", "copy", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "disc", "discard", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ew-resize", "expanded", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer", "landscape", "lao", "large", "larger", "left", "level", "lighter", "line-through", "linear", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "malayalam", "match", "media-controls-background", "media-current-time-display", "media-fullscreen-button", "media-mute-button", "media-play-button", "media-return-to-realtime-button", "media-rewind-button", "media-seek-back-button", "media-seek-forward-button", "media-slider", "media-sliderthumb", "media-time-remaining-display", "media-volume-slider", "media-volume-slider-container", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menulist-text", "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "myanmar", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "persian", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "round", "row-resize", "rtl", "run-in", "running", "s-resize", "sans-serif", "scroll", "scrollbar", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "single", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub", "subpixel-antialiased", "super", "sw-resize", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "transparent", "ultra-condensed", "ultra-expanded", "underline", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "x-large", "x-small", "xor", "xx-large", "xx-small"]);
					CodeMirror.defineMIME("text/css", {
						atMediaTypes : c,
						atMediaFeatures : d,
						propertyKeywords : e,
						colorKeywords : f,
						valueKeywords : g,
						hooks : {
							"<" : function (a, b) {
								function c(a, b) {
									for (var c, d = 0; null != (c = a.next()); ) {
										if (d >= 2 && ">" == c) {
											b.tokenize = null;
											break
										}
										d = "-" == c ? d + 1 : 0
									}
									return ["comment", "comment"]
								}
								return a.eat("!") ? (b.tokenize = c, c(a, b)) : void 0
							},
							"/" : function (a, c) {
								return a.eat("*") ? (c.tokenize = b, b(a, c)) : !1
							}
						},
						name : "css"
					}),
					CodeMirror.defineMIME("text/x-scss", {
						atMediaTypes : c,
						atMediaFeatures : d,
						propertyKeywords : e,
						colorKeywords : f,
						valueKeywords : g,
						allowNested : !0,
						hooks : {
							":" : function (a) {
								return a.match(/\s*{/) ? [null, "{"] : !1
							},
							$ : function (a) {
								return a.match(/^[\w-]+/),
								":" == a.peek() ? ["variable", "variable-definition"] : ["variable", "variable"]
							},
							"/" : function (a, c) {
								return a.eat("/") ? (a.skipToEnd(), ["comment", "comment"]) : a.eat("*") ? (c.tokenize = b, b(a, c)) : ["operator", "operator"]
							},
							"#" : function (a) {
								return a.eat("{") ? ["operator", "interpolation"] : (a.eatWhile(/[\w\\\-]/), ["atom", "hash"])
							}
						},
						name : "css"
					})
				}
					(), define("codemirror/modes/css", ["codemirror/codemirror"], function () {}), define("strut/themes/StylesheetProvider", ["tantaman/web/widgets/CodeEditor", "tantaman/web/widgets/Button", "tantaman/web/css_manip/CssManip", "css!styles/strut.themes/stylesheetEditor.css", "./StylesheetPreProcessor", "codemirror/modes/css"], function (a, b, c, d, e) {
						function f(a) {
							this._cssEditor = g,
							this._editorModel = a,
							i.innerHTML = a.customStylesheet(),
							a.deck().on("change:customStylesheet", this._editorSheetChanged, this),
							this._button = new b({
									icon : "icon-edit",
									cb : this._launch.bind(this),
									name : "CSS"
								}),
							this._button.$el.addClass("iconBtns btn-grouped"),
							this._cssSaved = this._cssSaved.bind(this),
							j || (j = !0)
						}
						var g = new a({
								"class" : "stylesheetEditor",
								title : "Edit CSS",
								placeholder : "/*.example {\n	border: 4px groove orange;\n}*/",
								mode : "css"
							}),
						h = "userStylesheet",
						i = c.getStyleElem({
								id : h,
								create : !0
							}),
						j = !1;
						return $("#modals").append(g.render().$el),
						f.prototype = {
							view : function () {
								return this._button
							},
							_launch : function () {
								var a = this._editorModel.customStylesheet();
								this._cssEditor.show(this._cssSaved, e.beforeEdit(a))
							},
							_cssSaved : function (a) {
								a = e.beforeSave(a),
								i.innerHTML = a,
								this._editorModel.customStylesheet(a),
								this._cssEditor.hide()
							},
							_editorSheetChanged : function (a, b) {
								i.innerHTML = b
							},
							dispose : function () {
								this._editorModel.deck().off(null, null, this)
							}
						},
						f
					}), define("tantaman/web/widgets/PopoverTextbox", ["libs/backbone"], function (a) {
						return a.View.extend({
							events : {
								"click .ok" : "_save",
								"click .cancel" : "hide",
								click : "_stopProp",
								mousedown : "_stopProp"
							},
							className : "popover",
							initialize : function () {
								this.hide = this.hide.bind(this),
								this.template = JST["tantaman.web.widgets/PopoverTextbox"]
							},
							show : function (a, b, c) {
								console.log("Showing popover"),
								this._cb = b,
								this.$el.css(a),
								this.$el.css("display", "block"),
								this.$input.val(c),
								this.$input.focus()
							},
							hide : function () {
								this.$el.css("display", ""),
								this.$input.val("")
							},
							_save : function (a) {
								a.stopPropagation(),
								this._cb(this.$input.val())
							},
							_stopProp : function (a) {
								a.stopPropagation()
							},
							render : function () {
								return this.$el.html(this.template(this.options)),
								this.$input = this.$el.find("input"),
								this
							},
							remove : function () {
								a.View.prototype.remove.apply(this, arguments)
							},
							constructor : function () {
								a.View.prototype.constructor.apply(this, arguments)
							}
						})
					}), define("strut/themes/ClassEditor", ["tantaman/web/widgets/Button", "tantaman/web/widgets/PopoverTextbox"], function (a, b) {
						function c(c) {
							this._button = new a({
									icon : "icon-plus",
									cb : this._launch.bind(this),
									name : "Class"
								}),
							this._appended = !1,
							this._button.$el.addClass("iconBtns btn-grouped"),
							this._button.disable(),
							this._deck = c.deck(),
							this._popover = new b({
									title : "Classes: "
								}),
							this._popover.render();
							var d = this._deck.get("activeSlide");
							d && this._activeSlideChanged(this._deck, d),
							this._deck.on("change:activeSlide", this._activeSlideChanged, this),
							this._classesSaved = this._classesSaved.bind(this)
						}
						return c.prototype = {
							view : function () {
								return this._button
							},
							_activeSlideChanged : function (a, b) {
								this._activeSlide && this._activeSlide.off(null, null, this),
								this._activeSlide = b,
								this._activeSlide && (this._activeSlide.on("change:activeComponent", this._activeComponentsChanged, this), this._activeComponentsChanged(b))
							},
							_activeComponentsChanged : function () {
								this._activeComponents = this._activeSlide.selected,
								this._activeComponents.length ? this._button.enable() : this._button.disable(),
								this._popover.hide()
							},
							_launch : function () {
								if (!this._appended) {
									var a = $(".slideContainer");
									a.append(this._popover.$el),
									this._appended = !0
								}
								this._activeComponents.length ? this._popover.show({
									left : this._activeComponents[0].get("x"),
									top : this._activeComponents[0].get("y")
								}, this._classesSaved, this._activeComponents[0].customClasses()) : alert("Please, select some component first.")
							},
							_classesSaved : function (a) {
								this._activeComponents.forEach(function (b) {
									b.customClasses(a)
								}),
								this._popover.hide()
							},
							dispose : function () {
								this._activeSlide && this._activeSlide.off(null, null, this),
								this._deck.off(null, null, this),
								this._popover.remove()
							}
						},
						c
					}), define("strut/themes/main", ["./BackgroundProvider", "./AvailableBackgrounds", "./AvailableSurfaces", "./StylesheetProvider", "./ClassEditor"], function (a, b, c, d, e) {
						"use strict";
						var f = {
							create : function (c) {
								return new a({
									backgrounds : b,
									editorModel : c,
									selector : ".operatingTable .slideContainer",
									attr : "Background",
									template : JST["strut.themes/BackgroundChooserDropdown"]
								})
							}
						},
						g = {
							create : function (b) {
								return new a({
									backgrounds : c,
									editorModel : b,
									selector : ".strut-surface",
									attr : "Surface",
									template : JST["strut.themes/SurfaceChooserDropdown"]
								})
							}
						},
						h = {
							create : function (a) {
								return new d(a)
							}
						},
						i = {
							create : function (a) {
								return new e(a)
							}
						};
						return {
							initialize : function (a) {
								a.register({
									interfaces : "strut.ThemeProvider",
									meta : {
										modes : {
											"slide-editor" : !0,
											overview : !0
										},
										overflow : !1
									}
								}, f),
								a.register({
									interfaces : "strut.ThemeProvider",
									meta : {
										modes : {
											"slide-editor" : !0,
											overview : !0
										},
										overflow : !1
									}
								}, g),
								a.register({
									interfaces : "strut.ThemeProvider",
									meta : {
										modes : {
											overview : !0,
											"slide-editor" : !0
										},
										overflow : !0
									}
								}, h),
								a.register({
									interfaces : "strut.ThemeProvider",
									meta : {
										modes : {
											overview : !0,
											"slide-editor" : !0
										},
										overflow : !0
									}
								}, i)
							}
						}
					}), function () {
					function a(a, b, c) {
						return a.addEventListener ? (a.addEventListener(b, c, !1), void 0) : (a.attachEvent("on" + b, c), void 0)
					}
					function b(a) {
						if ("keypress" == a.type) {
							var b = String.fromCharCode(a.which);
							return a.shiftKey || (b = b.toLowerCase()),
							b
						}
						return s[a.which] ? s[a.which] : t[a.which] ? t[a.which] : String.fromCharCode(a.which).toLowerCase()
					}
					function c(a, b) {
						return a.sort().join(",") === b.sort().join(",")
					}
					function d(a, b) {
						a = a || {};
						var c,
						d = !1;
						for (c in y)
							a[c] && y[c] > b ? d = !0 : y[c] = 0;
						d || (A = !1)
					}
					function e(a, b, d, e, f) {
						var g,
						h,
						i = [],
						k = d.type;
						if (!w[a])
							return [];
						for ("keyup" == k && j(a) && (b = [a]), g = 0; g < w[a].length; ++g)
							h = w[a][g], h.seq && y[h.seq] != h.level || k == h.action && ("keypress" == k && !d.metaKey && !d.ctrlKey || c(b, h.modifiers)) && (e && h.combo == f && w[a].splice(g, 1), i.push(h));
						return i
					}
					function f(a) {
						var b = [];
						return a.shiftKey && b.push("shift"),
						a.altKey && b.push("alt"),
						a.ctrlKey && b.push("ctrl"),
						a.metaKey && b.push("meta"),
						b
					}
					function g(a, b, c) {
						C.stopCallback(b, b.target || b.srcElement, c) || a(b, c) === !1 && (b.preventDefault && b.preventDefault(), b.stopPropagation && b.stopPropagation(), b.returnValue = !1, b.cancelBubble = !0)
					}
					function h(a, b, c) {
						var f,
						h = e(a, b, c),
						i = {},
						k = 0,
						l = !1;
						for (f = 0; f < h.length; ++f)
							h[f].seq ? (l = !0, k = Math.max(k, h[f].level), i[h[f].seq] = 1, g(h[f].callback, c, h[f].combo)) : l || A || g(h[f].callback, c, h[f].combo);
						c.type != A || j(a) || d(i, k)
					}
					function i(a) {
						"number" != typeof a.which && (a.which = a.keyCode);
						var c = b(a);
						if (c) {
							if ("keyup" == a.type && z == c)
								return z = !1, void 0;
							"keydown" == a.type ? C.pressed[c] = !0 : "keyup" == a.type && delete C.pressed[c],
							C.handleKey(c, f(a), a)
						}
					}
					function j(a) {
						return "shift" == a || "ctrl" == a || "alt" == a || "meta" == a
					}
					function k() {
						clearTimeout(r),
						r = setTimeout(d, 1e3)
					}
					function l() {
						if (!q) {
							q = {};
							for (var a in s)
								a > 95 && 112 > a || s.hasOwnProperty(a) && (q[s[a]] = a)
						}
						return q
					}
					function m(a, b, c) {
						return c || (c = l()[a] ? "keydown" : "keypress"),
						"keypress" == c && b.length && (c = "keydown"),
						c
					}
					function n(a, c, e, f) {
						y[a] = 0,
						f || (f = m(c[0], []));
						var h,
						i = function () {
							A = f,
							++y[a],
							k()
						},
						j = function (c) {
							g(e, c, a),
							"keyup" !== f && (z = b(c)),
							setTimeout(d, 10)
						};
						for (h = 0; h < c.length; ++h)
							o(c[h], h < c.length - 1 ? i : j, f, a, h)
					}
					function o(a, b, c, d, f) {
						x[a + ":" + c] = b,
						a = a.replace(/\s+/g, " ");
						var g,
						h,
						i,
						k = a.split(" "),
						l = [];
						if (k.length > 1)
							return n(a, k, b, c), void 0;
						for (i = "+" === a ? ["+"] : a.split("+"), g = 0; g < i.length; ++g)
							h = i[g], v[h] && (h = v[h]), c && "keypress" != c && u[h] && (h = u[h], l.push("shift")), j(h) && l.push(h);
						c = m(h, l, c),
						w[h] || (w[h] = []),
						e(h, l, {
							type : c
						}, !d, a),
						w[h][d ? "unshift" : "push"]({
							callback : b,
							modifiers : l,
							action : c,
							seq : d,
							level : f,
							combo : a
						})
					}
					function p(a, b, c) {
						for (var d = 0; d < a.length; ++d)
							o(a[d], b, c)
					}
					for (var q, r, s = {
							8 : "backspace",
							9 : "tab",
							13 : "enter",
							16 : "shift",
							17 : "ctrl",
							18 : "alt",
							20 : "capslock",
							27 : "esc",
							32 : "space",
							33 : "pageup",
							34 : "pagedown",
							35 : "end",
							36 : "home",
							37 : "left",
							38 : "up",
							39 : "right",
							40 : "down",
							45 : "ins",
							46 : "del",
							91 : "meta",
							93 : "meta",
							224 : "meta"
						}, t = {
							106 : "*",
							107 : "+",
							109 : "-",
							110 : ".",
							111 : "/",
							186 : ";",
							187 : "=",
							188 : ",",
							189 : "-",
							190 : ".",
							191 : "/",
							192 : "`",
							219 : "[",
							220 : "\\",
							221 : "]",
							222 : "'"
						}, u = {
							"~" : "`",
							"!" : "1",
							"@" : "2",
							"#" : "3",
							$ : "4",
							"%" : "5",
							"^" : "6",
							"&" : "7",
							"*" : "8",
							"(" : "9",
							")" : "0",
							_ : "-",
							"+" : "=",
							":" : ";",
							'"' : "'",
							"<" : ",",
							">" : ".",
							"?" : "/",
							"|" : "\\"
						}, v = {
							option : "alt",
							command : "meta",
							"return" : "enter",
							escape : "esc"
						}, w = {}, x = {}, y = {}, z = !1, A = !1, B = 1; 20 > B; ++B)
						s[111 + B] = "f" + B;
					for (B = 0; 9 >= B; ++B)
						s[B + 96] = B;
					a(document, "keypress", i),
					a(document, "keydown", i),
					a(document, "keyup", i);
					var C = {
						bind : function (a, b, c) {
							return a = a instanceof Array ? a : [a],
							p(a, b, c),
							this
						},
						unbind : function (a, b) {
							return C.bind(a, function () {}, b)
						},
						trigger : function (a, b) {
							return x[a + ":" + b] && x[a + ":" + b]({}, a),
							this
						},
						reset : function () {
							return w = {},
							x = {},
							this
						},
						stopCallback : function (a, b) {
							return (" " + b.className + " ").indexOf(" mousetrap ") > -1 ? !1 : "INPUT" == b.tagName || "SELECT" == b.tagName || "TEXTAREA" == b.tagName || b.contentEditable && "true" == b.contentEditable
						},
						handleKey : h,
						pressed : {}

					};
					window.Mousetrap = C,
					"function" == typeof define && define.amd && define("libs/mousetrap", C)
				}
					(), define("strut/editor/GlobalEvents", ["libs/mousetrap", "libs/backbone"], function (a, b) {
						"use strict";
						var c = _.extend({
								pressed : a.pressed
							}, b.Events);
						return a.bind(["ctrl+x", "command+x"], function (a) {
							c.trigger("cut", a)
						}),
						a.bind(["ctrl+c", "command+c"], function (a) {
							c.trigger("copy", a)
						}),
						a.bind(["ctrl+v", "command+v"], function (a) {
							c.trigger("paste", a)
						}),
						a.bind(["del", "command+backspace"], function (a) {
							c.trigger("delete", a)
						}),
						a.bind(["ctrl+z", "command+z"], function (a) {
							c.trigger("undo", a)
						}),
						a.bind(["ctrl+y", "command+y"], function (a) {
							c.trigger("redo", a)
						}),
						$(window).blur(function () {
							var a = Object.keys(c.pressed);
							a.forEach(function (a) {
								delete c.pressed[a]
							})
						}),
						c
					}), define("strut/editor/main", ["./GlobalEvents", "lang"], function (a, b) {
						"use strict";
						return {
							initialize : function (c) {
								var d;
								d = -1 != navigator.appVersion.indexOf("Mac") ? [["undo", "⌘+Z"], ["redo", "⌘+Y"], ["cut", "⌘+X"], ["copy", "⌘+C"], ["paste", "⌘+V"], ["delete", "⌘+⌫"]] : [["undo", "Ctrl+Z"], ["redo", "Ctrl+Y"], ["cut", "Ctrl+X"], ["copy", "Ctrl+C"], ["paste", "Ctrl+V"], ["delete", "Del"]],
								d.forEach(function (d) {
									c.register({
										interfaces : "strut.editor.glob.action",
										meta : {
											title : b[d[0]],
											action : d[0],
											hotkey : d[1]
										}
									}, function () {
										a.trigger(d[0])
									})
								})
							}
						}
					}), define("common/FileUtils", [], function () {
						var a;
						return a = {
							baseName : function (a, b) {
								var c;
								return "/" === a[a.length - 1] && (a = a.substring(0, a.length - 1)),
								c = a.lastIndexOf("/"),
								-1 !== c && c + 1 < a.length && (a = a.substring(c + 1, a.length)),
								null != b && (c = a.lastIndexOf(b), c + b.length === a.length && (a = a.substring(0, c))),
								a
							},
							imageType : function (b) {
								var c;
								return 0 === b.indexOf("data:") ? (c = b.indexOf(";"), b.substring(11, c).toUpperCase()) : a.extension(b)
							},
							extension : function (a) {
								var b,
								c;
								return c = a.lastIndexOf("."),
								-1 !== c && c + 1 < a.length ? (b = a.substring(c + 1, a.length), c = b.lastIndexOf("?"), -1 !== c && (b = b.substring(0, c)), b.toUpperCase()) : ""
							},
							type : function (a) {
								switch (a) {
								case "MP4":
									return "video/mp4";
								case "WEBM":
									return "video/webm";
								case "OGG":
									return "video/ogg";
								default:
									return ""
								}
							},
							createDownloadAttrs : function (a, b, c) {
								var d,
								e,
								f;
								return e = new Blob([b], {
										type : a
									}),
								f = window.URL.createObjectURL(e),
								d = {
									href : f,
									download : c,
									downloadurl : [a, c, f].join(":")
								}
							},
							toText : function (a, b) {
								var c;
								return console.log(a.type),
								null != a ? (c = new FileReader, c.onload = function (a) {
									return b(a.target.result)
								}, c.readAsText(a)) : void 0
							}
						}
					}), define("strut/exporter/json/View", ["libs/backbone", "common/FileUtils", "lang"], function (a, b, c) {
						"use strict";
						return a.View.extend({
							initialize : function () {
								this.name = "JSON",
								this._rendered = !1,
								this._dlSupported = window.dlSupported,
								this.$el.html('<div class="alert alert-info">' + c.strut_exporter_json.explain + "</div>"),
								this._dlSupported && this.$el.append('<div class="alert alert-success">' + c.strut_exporter_json.click_below + "</div>")
							},
							show : function (a, b) {
								this._$modal = b;
								var c = this._$modal.find(".ok");
								this._dlSupported ? (c.html('<i class="icon-download-alt icon-white"></i>'), this._makeDownloadable(c)) : (c.html(""), window.hasFlash ? this._populateDownloadify() : this._populateTextArea()),
								a.append(this.$el)
							},
							_makeDownloadable : function (a) {
								var c = b.createDownloadAttrs("application/json", JSON.stringify(this._exportable.export(), null, 2), this._exportable.identifier() + ".json"),
								d = a[0];
								d.download = c.download,
								d.href = c.href,
								d.dataset.downloadurl = c.downloadurl
							},
							_populateTextArea : function () {
								var a = this.$el.find("textarea");
								0 == a.length && (a = $('<textarea style="width: 500px; height: 200px;"></textarea>'), this.$el.append(a)),
								a.val(JSON.stringify(this._exportable.export()))
							},
							_populateDownloadify : function () {
								var a = this.$el.find("#downloadify");
								if (0 == a.length) {
									a = $('<p id="downloadify"></p>'),
									this.$el.append(a),
									console.log("Puplating downloadify");
									var b = this;
									setTimeout(function () {
										Downloadify.create(a[0], {
											filename : function () {
												return b._exportable.identifier() + ".json"
											},
											data : function () {
												return JSON.stringify(b._exportable.export(), null, 2)
											},
											onComplete : function () {},
											onCancel : function () {},
											onError : function () {
												alert("Error exporting")
											},
											swf : "preview_export/download_assist/downloadify.swf",
											downloadImage : "preview_export/download_assist/download.png",
											width : 100,
											height : 30,
											transparent : !1,
											append : !1
										})
									}, 0)
								}
							},
							hide : function () {
								this.$el.detach(),
								this.hidden()
							},
							hidden : function () {
								if (this._dlSupported) {
									var a = this._$modal.find(".ok");
									window.URL.revokeObjectURL(a.attr("href"))
								} else
									this.$el.find("textarea").val("")
							},
							render : function () {},
							constructor : function (b) {
								this._exportable = b,
								a.View.prototype.constructor.call(this)
							}
						})
					}), define("strut/exporter/json/main", ["./View"], function (a) {
						"use strict";
						var b = {
							createView : function (b) {
								return new a(b.exportable)
							}
						};
						return {
							initialize : function (a) {
								a.register({
									interfaces : "strut.exporter"
								}, b)
							}
						}
					}), define("libs/jszip", [], function () {
						var a = function (a, b) {
							this.files = {},
							this.root = "",
							a && this.load(a, b)
						};
						a.signature = {
							LOCAL_FILE_HEADER : "PK",
							CENTRAL_FILE_HEADER : "PK",
							CENTRAL_DIRECTORY_END : "PK",
							ZIP64_CENTRAL_DIRECTORY_LOCATOR : "PK",
							ZIP64_CENTRAL_DIRECTORY_END : "PK",
							DATA_DESCRIPTOR : "PK\b"
						},
						a.defaults = {
							base64 : !1,
							binary : !1,
							dir : !1,
							date : null,
							compression : null
						},
						a.prototype = function () {
							var c = function (a, b, c) {
								this.name = a,
								this.data = b,
								this.options = c
							};
							c.prototype = {
								asText : function () {
									var c = this.data;
									return null === c || "undefined" == typeof c ? "" : (this.options.base64 && (c = b.decode(c)), this.options.binary && (c = a.prototype.utf8decode(c)), c)
								},
								asBinary : function () {
									var c = this.data;
									return null === c || "undefined" == typeof c ? "" : (this.options.base64 && (c = b.decode(c)), this.options.binary || (c = a.prototype.utf8encode(c)), c)
								},
								asUint8Array : function () {
									return a.utils.string2Uint8Array(this.asBinary())
								},
								asArrayBuffer : function () {
									return a.utils.string2Uint8Array(this.asBinary()).buffer
								}
							};
							var d = function (a, b) {
								var c,
								d = "";
								for (c = 0; b > c; c++)
									d += String.fromCharCode(255 & a), a >>>= 8;
								return d
							},
							e = function () {
								var a,
								b,
								c = {};
								for (a = 0; a < arguments.length; a++)
									for (b in arguments[a])
										arguments[a].hasOwnProperty(b) && "undefined" == typeof c[b] && (c[b] = arguments[a][b]);
								return c
							},
							f = function (b) {
								return b = b || {},
								b.base64 === !0 && null == b.binary && (b.binary = !0),
								b = e(b, a.defaults),
								b.date = b.date || new Date,
								null !== b.compression && (b.compression = b.compression.toUpperCase()),
								b
							},
							g = function (b, d, e) {
								var g = h(b);
								if (g && i.call(this, g), e = f(e), e.dir || null === d || "undefined" == typeof d)
									e.base64 = !1, e.binary = !1, d = null;
								else if (a.support.uint8array && d instanceof Uint8Array)
									e.base64 = !1, e.binary = !0, d = a.utils.uint8Array2String(d);
								else if (a.support.arraybuffer && d instanceof ArrayBuffer) {
									e.base64 = !1,
									e.binary = !0;
									var j = new Uint8Array(d);
									d = a.utils.uint8Array2String(j)
								} else
									e.binary && !e.base64 && (e.optimizedBinaryString !== !0 && (d = a.utils.string2binary(d)), delete e.optimizedBinaryString);
								return this.files[b] = new c(b, d, e)
							},
							h = function (a) {
								"/" == a.slice(-1) && (a = a.substring(0, a.length - 1));
								var b = a.lastIndexOf("/");
								return b > 0 ? a.substring(0, b) : ""
							},
							i = function (a) {
								if ("/" != a.slice(-1) && (a += "/"), !this.files[a]) {
									var b = h(a);
									b && i.call(this, b),
									g.call(this, a, null, {
										dir : !0
									})
								}
								return this.files[a]
							},
							j = function (b, c, e) {
								var f,
								g,
								h = c !== b.name,
								i = b.asBinary(),
								j = b.options;
								f = j.date.getHours(),
								f <<= 6,
								f |= j.date.getMinutes(),
								f <<= 5,
								f |= j.date.getSeconds() / 2,
								g = j.date.getFullYear() - 1980,
								g <<= 4,
								g |= j.date.getMonth() + 1,
								g <<= 5,
								g |= j.date.getDate();
								var k = null !== i && 0 !== i.length;
								if (e = j.compression || e, !a.compressions[e])
									throw e + " is not a valid compression method !";
								var l = a.compressions[e],
								m = k ? l.compress(i) : "",
								n = "";
								return n += "\n\x00",
								n += h ? "\x00\b" : "\x00\x00",
								n += k ? l.magic : a.compressions.STORE.magic,
								n += d(f, 2),
								n += d(g, 2),
								n += k ? d(this.crc32(i), 4) : "\x00\x00\x00\x00",
								n += k ? d(m.length, 4) : "\x00\x00\x00\x00",
								n += k ? d(i.length, 4) : "\x00\x00\x00\x00",
								n += d(c.length, 2),
								n += "\x00\x00", {
									header : n,
									compressedData : m
								}
							};
							return {
								load : function () {
									throw new Error("Load method is not defined. Is the file jszip-load.js included ?")
								},
								filter : function (a) {
									var b,
									d,
									f,
									g,
									h = [];
									for (b in this.files)
										this.files.hasOwnProperty(b) && (f = this.files[b], g = new c(f.name, f.data, e(f.options)), d = b.slice(this.root.length, b.length), b.slice(0, this.root.length) === this.root && a(d, g) && h.push(g));
									return h
								},
								file : function (a, b, c) {
									if (1 === arguments.length) {
										if (a instanceof RegExp) {
											var d = a;
											return this.filter(function (a, b) {
												return !b.options.dir && d.test(a)
											})
										}
										return this.filter(function (b, c) {
											return !c.options.dir && b === a
										})[0] || null
									}
									return a = this.root + a,
									g.call(this, a, b, c),
									this
								},
								folder : function (a) {
									if (!a)
										return this;
									if (a instanceof RegExp)
										return this.filter(function (b, c) {
											return c.options.dir && a.test(b)
										});
									var b = this.root + a,
									c = i.call(this, b),
									d = this.clone();
									return d.root = c.name,
									d
								},
								remove : function (a) {
									a = this.root + a;
									var b = this.files[a];
									if (b || ("/" != a.slice(-1) && (a += "/"), b = this.files[a]), b)
										if (b.options.dir)
											for (var c = this.filter(function (b, c) {
														return c.name.slice(0, a.length) === a
													}), d = 0; d < c.length; d++)
												delete this.files[c[d].name];
										else
											delete this.files[a];
									return this
								},
								generate : function (c) {
									c = e(c || {}, {
											base64 : !0,
											compression : "STORE",
											type : "base64"
										});
									var f = c.compression.toUpperCase();
									if (!a.compressions[f])
										throw f + " is not a valid compression method !";
									var g = [],
									h = [],
									i = 0;
									for (var k in this.files)
										if (this.files.hasOwnProperty(k)) {
											var l = this.files[k],
											m = this.utf8encode(l.name),
											n = "",
											o = "",
											p = j.call(this, l, m, f);
											n = a.signature.LOCAL_FILE_HEADER + p.header + m + p.compressedData,
											o = a.signature.CENTRAL_FILE_HEADER + "\x00" + p.header + "\x00\x00" + "\x00\x00" + "\x00\x00" + (this.files[k].options.dir === !0 ? "\x00\x00\x00" : "\x00\x00\x00\x00") + d(i, 4) + m,
											i += n.length,
											h.push(n),
											g.push(o)
										}
									var q = h.join(""),
									r = g.join(""),
									s = "";
									s = a.signature.CENTRAL_DIRECTORY_END + "\x00\x00" + "\x00\x00" + d(h.length, 2) + d(h.length, 2) + d(r.length, 4) + d(q.length, 4) + "\x00\x00";
									var t = q + r + s;
									switch (c.type.toLowerCase()) {
									case "uint8array":
										return a.utils.string2Uint8Array(t);
									case "arraybuffer":
										return a.utils.string2Uint8Array(t).buffer;
									case "blob":
										return a.utils.string2Blob(t);
									case "base64":
										return c.base64 ? b.encode(t) : t;
									default:
										return t
									}
								},
								crc32 : function (a, b) {
									if ("" === a || "undefined" == typeof a)
										return 0;
									var c = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
									"undefined" == typeof b && (b = 0);
									var d = 0,
									e = 0;
									b = -1^b;
									for (var f = 0, g = a.length; g > f; f++)
										e = 255 & (b^a.charCodeAt(f)), d = c[e], b = b >>> 8^d;
									return -1^b
								},
								clone : function () {
									var b = new a;
									for (var c in this)
										"function" != typeof this[c] && (b[c] = this[c]);
									return b
								},
								utf8encode : function (a) {
									for (var b = "", c = 0; c < a.length; c++) {
										var d = a.charCodeAt(c);
										128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(192 | d >> 6), b += String.fromCharCode(128 | 63 & d)) : (b += String.fromCharCode(224 | d >> 12), b += String.fromCharCode(128 | 63 & d >> 6), b += String.fromCharCode(128 | 63 & d))
									}
									return b
								},
								utf8decode : function (a) {
									for (var b = "", c = 0, d = 0, e = 0, f = 0; c < a.length; )
										d = a.charCodeAt(c), 128 > d ? (b += String.fromCharCode(d), c++) : d > 191 && 224 > d ? (e = a.charCodeAt(c + 1), b += String.fromCharCode((31 & d) << 6 | 63 & e), c += 2) : (e = a.charCodeAt(c + 1), f = a.charCodeAt(c + 2), b += String.fromCharCode((15 & d) << 12 | (63 & e) << 6 | 63 & f), c += 3);
									return b
								}
							}
						}
						(),
						a.compressions = {
							STORE : {
								magic : "\x00\x00",
								compress : function (a) {
									return a
								},
								uncompress : function (a) {
									return a
								}
							}
						},
						a.support = {
							arraybuffer : function () {
								return "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array
							}
							(),
							uint8array : function () {
								return "undefined" != typeof Uint8Array
							}
							(),
							blob : function () {
								if ("undefined" == typeof ArrayBuffer)
									return !1;
								var a = new ArrayBuffer(0);
								try {
									return 0 === new Blob([a], {
										type : "application/zip"
									}).size
								} catch (b) {}

								try {
									var c = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder);
									return c.append(a),
									0 === c.getBlob("application/zip").size
								} catch (b) {}

								return !1
							}
							()
						},
						a.utils = {
							string2binary : function (a) {
								for (var b = "", c = 0; c < a.length; c++)
									b += String.fromCharCode(255 & a.charCodeAt(c));
								return b
							},
							string2Uint8Array : function (b) {
								if (!a.support.uint8array)
									throw new Error("Uint8Array is not supported by this browser");
								for (var c = new ArrayBuffer(b.length), d = new Uint8Array(c), e = 0; e < b.length; e++)
									d[e] = b.charCodeAt(e);
								return d
							},
							uint8Array2String : function (b) {
								if (!a.support.uint8array)
									throw new Error("Uint8Array is not supported by this browser");
								for (var c = "", d = 0; d < b.length; d++)
									c += String.fromCharCode(b[d]);
								return c
							},
							string2Blob : function (b) {
								if (!a.support.blob)
									throw new Error("Blob is not supported by this browser");
								var c = a.utils.string2Uint8Array(b).buffer;
								try {
									return new Blob([c], {
										type : "application/zip"
									})
								} catch (d) {}

								try {
									var e = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder);
									return e.append(c),
									e.getBlob("application/zip")
								} catch (d) {}

								throw new Error("Bug : can't construct the Blob.")
							}
						};
						var b = function () {
							var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
							return {
								encode : function (b) {
									for (var c, d, e, f, g, h, i, j = "", k = 0; k < b.length; )
										c = b.charCodeAt(k++), d = b.charCodeAt(k++), e = b.charCodeAt(k++), f = c >> 2, g = (3 & c) << 4 | d >> 4, h = (15 & d) << 2 | e >> 6, i = 63 & e, isNaN(d) ? h = i = 64 : isNaN(e) && (i = 64), j = j + a.charAt(f) + a.charAt(g) + a.charAt(h) + a.charAt(i);
									return j
								},
								decode : function (b) {
									var c,
									d,
									e,
									f,
									g,
									h,
									i,
									j = "",
									k = 0;
									for (b = b.replace(/[^A-Za-z0-9\+\/\=]/g, ""); k < b.length; )
										f = a.indexOf(b.charAt(k++)), g = a.indexOf(b.charAt(k++)), h = a.indexOf(b.charAt(k++)), i = a.indexOf(b.charAt(k++)), c = f << 2 | g >> 4, d = (15 & g) << 4 | h >> 2, e = (3 & h) << 6 | i, j += String.fromCharCode(c), 64 != h && (j += String.fromCharCode(d)), 64 != i && (j += String.fromCharCode(e));
									return j
								}
							}
						}
						();
						return a
					}), define("common/Calcium", ["libs/backbone"], function (a) {
						function b(b) {
							return b instanceof a.Model || b instanceof a.Collection
						}
						function c(a, b, c) {
							this.args = c,
							this.obj = a,
							this.fn = b
						}
						var d = a.Model.extend({
								toJSON : function (c, d) {
									if (c)
										return a.Model.prototype.toJSON.apply(this, arguments);
									var e = {};
									for (var f in this.attributes) {
										var g = this.attributes[f];
										if (b(g))
											e[f] = g.toJSON(c, d);
										else if (d && g instanceof Array) {
											var h = [];
											e[f] = h,
											g.forEach(function (a) {
												b(a) ? h.push(a.toJSON(c, d)) : h.push(a)
											})
										} else
											e[f] = g
									}
									return e
								}
							}),
						e = a.Collection.extend({
								toJSON : function (b, c) {
									if (b)
										return a.Collection.prototype.toJSON.apply(this, arguments);
									var d = [];
									return this.models.forEach(function (a) {
										d.push(a.toJSON(b, c))
									}),
									d
								}
							});
						return c.prototype = {
							dispose : function () {
								this.fn.apply(this.obj, this.args)
							}
						}, {
							Model : d,
							Collection : e
						}
					}), define("common/Math2", {
						round : function (a, b) {
							var c;
							return null != b || (b = 0),
							c = Math.pow(10, b),
							Math.round(a * c) / c
						},
						toDeg : function (a) {
							return 180 * a / Math.PI
						},
						toRads : function (a) {
							return a * Math.PI / 180
						},
						compare : function (a, b, c) {
							return Math.abs(a - b) < c
						},
						rotatePt : function (a, b) {
							var c;
							return c = 0 > b ? {
								x : a.x * Math.cos(b) + a.y * Math.sin(b),
								y : -1 * a.x * Math.sin(b) + a.y * Math.cos(b)
							}
							 : {
								x : a.x * Math.cos(b) - a.y * Math.sin(b),
								y : a.x * Math.sin(b) + a.y * Math.cos(b)
							}
						},
						rotatePtE : function (a, b) {
							var c;
							return c = 0 > b ? {
								left : a.left * Math.cos(b) + a.top * Math.sin(b),
								top : -1 * a.left * Math.sin(b) + a.top * Math.cos(b)
							}
							 : {
								left : a.left * Math.cos(b) - a.top * Math.sin(b),
								top : a.left * Math.sin(b) + a.top * Math.cos(b)
							}
						}
					}), define("strut/deck/SpatialObject", ["common/Calcium", "common/Math2"], function (a, b) {
						"use strict";
						return a.Model.extend({
							initialize : function () {},
							setInt : function (a, b) {
								if ("string" == typeof b)
									try {
										b = parseInt(b, 10)
									} catch (c) {
										return
									}
								this.set(a, Math.round(b))
							},
							setFloat : function (a, c, d) {
								if ("string" == typeof c)
									try {
										c = parseFloat(c)
									} catch (e) {
										return
									}
								c = b.round(c, d || 2),
								this.set(a, c)
							},
							constructor : function () {
								a.Model.prototype.constructor.apply(this, arguments)
							}
						})
					}), define("strut/slide_components/ComponentFactory", [], function () {
						"use strict";
						function a(a) {
							var b = a.get("strut.ComponentModel");
							this._modelCtors = {},
							b.forEach(function (a) {
								this._modelCtors[a.meta().type] = a.service()
							}, this),
							this._viewCtors = {};
							var c = a.get("strut.ComponentView");
							c.forEach(function (a) {
								this._viewCtors[a.meta().type] = a.service()
							}, this),
							this._drawers = {};
							var d = a.get("strut.ComponentDrawer");
							d.forEach(function (a) {
								this._drawers[a.meta().type] = a.service()
							}, this)
						}
						return a.prototype = {
							createView : function (a) {
								var b = a.get("type"),
								c = this._viewCtors[b];
								return c ? new c({
									model : a
								}) : void 0
							},
							createModel : function (a, b) {
								if ("ImageModel" == a.type && (a.type = "Image"), "string" == typeof a)
									var c = a;
								else
									var c = a.type;
								var d = this._modelCtors[c];
								return d ? new d(a, b) : void 0
							},
							getDrawer : function (a) {
								return this._drawers[a]
							}
						}, {
							initialize : function (b) {
								log("Initing"),
								this.instance || (this.instance = new a(b))
							}
						}
					}), define("strut/deck/ComponentCommands", [], function () {
						function a(a, b, c, d) {
							this.start = a,
							this.end = b.get(c) || 0,
							this.component = b,
							this.name = d,
							this.attr = c
						}
						var b,
						c,
						d;
						return a.prototype = {
							"do" : function () {
								this.component.slide && this.component.slide.set("active", !0),
								this.component.set(this.attr, this.end),
								this.component.set("selected", !0)
							},
							undo : function () {
								this.component.slide && this.component.slide.set("active", !0),
								this.component.set(this.attr, this.start),
								this.component.set("selected", !0)
							}
						},
						b = function (a, b) {
							this.slide = a,
							this.components = b.slice(0)
						},
						b.prototype = {
							"do" : function () {
								this.slide.set("active", !0),
								this.slide.__doAdd(this.components)
							},
							undo : function () {
								this.slide.set("active", !0),
								this.slide.__doRemove(this.components)
							},
							name : "Add Comp"
						},
						c = function (a, b) {
							this.slide = a,
							this.components = b.slice(0)
						},
						c.prototype = {
							"do" : function () {
								this.slide.set("active", !0),
								this.slide.__doRemove(this.components)
							},
							undo : function () {
								this.slide.set("active", !0),
								this.slide.__doAdd(this.components)
							},
							name : "Remove Comp"
						},
						d = function (a, b) {
							return this.startLoc = a,
							this.component = b,
							this.endLoc = {
								x : this.component.get("x"),
								y : this.component.get("y")
							},
							this
						},
						d.prototype = {
							"do" : function () {
								this.component.slide && this.component.slide.set("active", !0),
								this.component.set(this.endLoc),
								this.component.set("selected", !0)
							},
							undo : function () {
								this.component.slide && this.component.slide.set("active", !0),
								this.component.set(this.startLoc),
								this.component.set("selected", !0)
							},
							name : "Move"
						}, {
							Add : b,
							Remove : c,
							Move : d,
							SkewX : function (b, c) {
								return new a(b, c, "skewX", "Skew X")
							},
							SkewY : function (b, c) {
								return new a(b, c, "skewY", "Skew Y")
							},
							Rotate : function (b, c) {
								return new a(b, c, "rotate", "Rotate")
							},
							Scale : function (b, c) {
								return new a(b, c, "scale", "Scale")
							},
							TextScale : function (b, c) {
								return new a(b, c, "size", "Scale")
							},
							Text : function (b, c) {
								return new a(b, c, "text", "Text")
							}
						}
					}), define("strut/deck/Slide", ["libs/backbone", "./SpatialObject", "strut/slide_components/ComponentFactory", "common/Math2", "./ComponentCommands", "tantaman/web/undo_support/CmdListFactory", "strut/editor/GlobalEvents"], function (a, b, c, d, e, f, g) {
						var h,
						i = f.managedInstance("editor");
						return h = {
							z : 0,
							impScale : 3,
							rotateX : 0,
							rotateY : 0,
							rotateZ : 0
						},
						b.extend({
							type : "slide",
							selected : [],
							initialize : function () {
								var b,
								d;
								b = this.get("components"),
								void 0 === b ? this.set("components", []) : (d = [], this.set("components", d), b.forEach(function (b) {
										var e;
										return b instanceof a.Model ? (e = b.clone(), d.push(e)) : (e = c.instance.createModel(b), d.push(e)),
										this._registerWithComponent(e)
									}, this)),
								_.defaults(this.attributes, h),
								this.on("unrender", this.unrendered, this),
								this.on("change:markdown", this._contentsChanged, this),
								b = this.get("components"),
								b.forEach(function (a) {
									a.get("selected") && this._selectionChanged(a, !0, {
										multiselect : !0
									})
								}, this)
							},
							unrendered : function () {
								this.get("components").forEach(function (a) {
									a.trigger("unrender", !0)
								})
							},
							_registerWithComponent : function (a) {
								a.slide = this,
								a.on("dispose", this._selectionChanged, this),
								a.on("change:selected", this._selectionChanged, this),
								a.on("change", this._contentsChanged, this)
							},
							customClasses : function () {
								return ""
							},
							getPositionData : function () {
								return {
									x : this.get("x"),
									y : this.get("y"),
									z : this.get("z"),
									impScale : this.get("impScale"),
									rotateX : this.get("rotateX"),
									rotateY : this.get("rotateY"),
									rotateZ : this.get("rotateZ")
								}
							},
							selectComponents : function (a) {
								a = _.isArray(a) ? a : [a],
								a.length && (this.get("components").forEach(function (a) {
										return a.set("selected", !1)
									}), a.forEach(function (a) {
										a.set("selected", !0, {
											multiselect : !0
										})
									}))
							},
							unselectComponents : function (a) {
								a = a || this.selected,
								a = _.isArray(a) ? a : [a],
								a.forEach(function (a) {
									a.set("selected", !1)
								})
							},
							_selectionChanged : function (a, b, c) {
								c = c || {};
								var d = c.multiselect || g.pressed.ctrl || g.pressed.meta || g.pressed.shift;
								if (b)
									d || this.get("components").forEach(function (b) {
										return a !== b ? b.set("selected", !1) : void 0
									}), -1 == this.selected.indexOf(a) && this.selected.push(a), this.trigger("change:activeComponent", this, a, b);
								else {
									var e = this.selected.indexOf(a);
									-1 !== e && this.selected.splice(e, 1),
									this.trigger("change:activeComponent", this, void 0)
								}
							},
							_contentsChanged : function () {
								this.trigger("contentsChanged")
							},
							add : function (a) {
								a = _.isArray(a) ? a.slice() : [a],
								a.forEach(function (a) {
									this._placeComponent(a)
								}, this);
								var b = new e.Add(this, a);
								b.do (), i.push(b)
							},
							__doAdd : function (a) {
								a.forEach(function (a) {
									this.get("components").push(a),
									this._registerWithComponent(a),
									this.trigger("contentsChanged"),
									this.trigger("change:components.add", this, a)
								}, this),
								this.selectComponents(a)
							},
							_placeComponent : function (a) {
								return this.get("components").forEach(function (b) {
									var c,
									e;
									return c = b.get("x"),
									e = b.get("y"),
									d.compare(c, a.get("x"), 5) && d.compare(e, a.get("y"), 5) ? a.set({
										x : c + 20,
										y : e + 20
									}) : void 0
								})
							},
							remove : function (a) {
								a = _.isArray(a) ? a : [a],
								i.pushdo(new e.Remove(this, a))
							},
							__doRemove : function (a) {
								a.forEach(function (a) {
									var b;
									return b = this.get("components").indexOf(a),
									-1 !== b ? (this.get("components").splice(b, 1), this.trigger("contentsChanged"), this.trigger("change:components.remove", this, a), this._selectionChanged(a, !1), a.trigger("unrender"), a.off(), a) : void 0
								}, this)
							},
							dispose : function () {
								this.set({
									active : !1,
									selected : !1
								}),
								this.trigger("dispose", this),
								this.off()
							},
							constructor : function () {
								b.prototype.constructor.apply(this, arguments)
							}
						})
					}), define("strut/deck/SlideCollection", ["common/Calcium", "./Slide"], function (a, b) {
						return a.Collection.extend({
							model : b,
							initialize : function () {
								this.on("add", this._updateIndexes, this),
								this.on("remove", this._updateIndexes, this)
							},
							_updateIndexes : function () {
								this.models.forEach(function (a, b) {
									return a.set("index", b)
								})
							},
							slidesReorganized : function (a) {
								var b = [];
								this.models.forEach(function (c, d) {
									b.push(a[d].getPositionData())
								}, this);
								var c = {
									silent : !0
								};
								return b.forEach(function (a, b) {
									this.models[b].set(a, c)
								}, this),
								this.models.forEach(function (a, b) {
									a.set("index", b)
								}),
								this
							},
							_swapTransitionPositions : function (a, b) {
								var c,
								d;
								d = a.getPositionData(),
								c = {
									silent : !0
								},
								a.set(b.getPositionData(), c),
								b.set(d, c)
							}
						})
					}), define("strut/deck/SlideCommands", ["strut/deck/Slide"], function () {
						var a,
						b,
						c;
						return a = function (a, b, c) {
							this.deck = a,
							this.selected = this.deck.selected.slice(0),
							this.activeSlide = this.deck.get("activeSlide"),
							this.slides = b ? b.slice(0) : null,
							this.index = c
						},
						a.prototype = {
							name : "Add Slide",
							"do" : function () {
								this.deck._doAdd(this.slides, {
									preserveIndexes : !1,
									at : this.index
								})
							},
							undo : function () {
								this.deck._doRemove(this.slides),
								this.deck.selectSlides(this.selected, this.activeSlide)
							}
						},
						b = function (a, b) {
							this.deck = a,
							this.slides = b.slice(0)
						},
						b.prototype = {
							name : "Remove Slide",
							"do" : function () {
								this.deck._doRemove(this.slides)
							},
							undo : function () {
								this.deck._doAdd(this.slides, {
									preserveIndexes : !0
								})
							}
						},
						c = function (a, b, c) {
							return this.deck = a,
							this.slides = b.slice(0),
							this.destination = c,
							this.selected = this.deck.selected.slice(0),
							this.activeSlide = this.deck.get("activeSlide"),
							this
						},
						c.prototype = {
							"do" : function () {
								var a = this.deck.get("slides");
								this.initial_slides_order = a.models.slice(0),
								this.initial_selection = this.deck.selected.slice(0),
								this.initial_active_slide = this.deck.get("activeSlide"),
								a.remove(this.slides, {
									silent : !0
								}),
								a.add(this.slides, {
									silent : !0,
									at : this.destination
								}),
								a.slidesReorganized(this.initial_slides_order),
								this.deck.unselectSlides(),
								this.deck.selectSlides(this.selected, this.activeSlide),
								this.deck.trigger("slideMoved")
							},
							undo : function () {
								var a = this.deck.get("slides").models.slice(0);
								this.deck.get("slides").models = this.initial_slides_order,
								this.deck.get("slides").slidesReorganized(a),
								this.deck.unselectSlides(),
								this.deck.selectSlides(this.initial_selection, this.initial_active_slide),
								this.deck.trigger("slideMoved")
							},
							name : "Move Slide"
						}, {
							Add : a,
							Remove : b,
							Move : c
						}
					}), define("strut/deck/DeckUpgrade", [], function () {
						function a(a) {
							var b = a.background;
							b && (a.background = void 0);
							var c = a.surface;
							c && (a.surface = void 0)
						}
						return {
							to1_0 : function (b) {
								"1.0" != b.deckVersion && (b.deckVersion = "1.0", a(b), b.slides.forEach(function (b) {
										a(b)
									}))
							}
						}
					}), define("strut/deck/CustomBackgrounds", ["common/Calcium"], function (a) {
						return a.Model.extend({
							initialize : function () {
								var a = this.get("bgs");
								a || (a = [], this.set("bgs", a)),
								this._bgIndex = {},
								a.forEach(function (a) {
									this._bgIndex[a] = !0
								}, this),
								this._lastPrune = a.length
							},
							prune : function (a) {
								var b = this.deck.get("slides"),
								c = this.deck.get("background"),
								d = this.deck.get("surface"),
								e = {},
								f = this.get("bgs");
								if (0 != f.length) {
									b.forEach(function (a) {
										var b = a.get("background");
										b && (e[b] = !0),
										b = a.get("surface"),
										b && (e[b] = !0)
									}),
									c && (e[c] = !0),
									d && (e[d] = !0);
									for (var g = f.length - 1; g > -1; --g) {
										var h = f[g].klass;
										null == e[h] && h !== a && (f.splice(g, 1), delete this._bgIndex[h])
									}
									this._lastPrune = f.length
								}
							},
							add : function (a) {
								var b = "bg-custom-" + a.replace("#", ""),
								c = this._bgIndex[b];
								return this.get("bgs").length - this._lastPrune > 10 && this.prune(b),
								c ? {
									existed : !0,
									klass : b
								}
								 : (this.get("bgs").push({
										klass : b,
										style : a
									}), this._bgIndex[b] = !0, {
									existed : !1,
									klass : b
								})
							},
							constructor : function () {
								a.Model.prototype.constructor.apply(this, arguments)
							}
						})
					}), define("strut/deck/Deck", ["common/Calcium", "./SlideCollection", "./SlideCommands", "tantaman/web/undo_support/CmdListFactory", "strut/deck/Slide", "strut/editor/GlobalEvents", "./DeckUpgrade", "./CustomBackgrounds"], function (a, b, c, d, e, f, g, h) {
						return a.Model.extend({
							selected : [],
							initialize : function () {
								var a;
								this.undoHistory = d.managedInstance("editor"),
								this.set("slides", new b),
								a = this.get("slides"),
								a.on("add", this._slideAdded, this),
								a.on("remove", this._slideRemoved, this),
								a.on("reset", this._slidesReset, this),
								this.set("background", "bg-default")
							},
							set : function (b, c, d) {
								return "activeSlide" === b && this._activeSlideChanging(c, d),
								a.Model.prototype.set.apply(this, arguments)
							},
							moveSlides : function (a, b) {
								a = _.isArray(a) ? a : [a];
								var d = !1;
								a.forEach(function (c, e) {
									a[e].get("index") != b + e && (d = !0)
								}, this),
								d && this.undoHistory.pushdo(new c.Move(this, a, b))
							},
							slideBackground : function () {
								return this.get("background") || "bg-transparent"
							},
							slideSurface : function () {
								return this.get("surface") || "bg-default"
							},
							addCustomBgClassFor : function (a) {
								var b = this.get("customBackgrounds");
								return b.add(a)
							},
							"import" : function (a) {
								g.to1_0(a);
								var b,
								c;
								c = this.get("slides"),
								b = this.get("activeSlide"),
								void 0 !== b && b.unselectComponents(),
								this.set("activeSlide", void 0),
								this.set("background", a.background),
								this.set("fileName", a.fileName),
								this.set("surface", a.surface),
								this.set("customStylesheet", a.customStylesheet),
								this.set("deckVersion", a.deckVersion),
								this.set("cannedTransition", a.cannedTransition);
								var d = new h(a.customBackgrounds);
								this.set("customBackgrounds", d),
								this.undoHistory.clear(),
								c.reset(a.slides),
								d.deck = this,
								d.prune()
							},
							_activeSlideChanging : function (a, b) {
								var c = this.get("activeSlide");
								a !== c && (c && (c.unselectComponents(), c.set({
											active : !1,
											selected : !1
										}, b)), a && a.set({
										selected : !0,
										active : !0
									}, b))
							},
							_slideAdded : function (a, b, c) {
								c = c || {},
								c.at = _.isNumber(c.at) ? c.at : b.length,
								this.set("activeSlide", a, c),
								this.trigger("slideAdded", a, c),
								this._registerWithSlide(a)
							},
							_slideDisposed : function (a) {
								a.off(null, null, this)
							},
							_slideRemoved : function (a, b, c) {
								c = c || {},
								this.get("activeSlide") === a && (c.index < b.length ? this.set("activeSlide", b.at(c.index)) : c.index > 0 ? this.set("activeSlide", b.at(c.index - 1)) : this.set("activeSlide", void 0)),
								a.dispose()
							},
							_slidesReset : function (a, b) {
								return b = b || {},
								b.previousModels.forEach(function (a) {
									a.dispose()
								}),
								this.trigger("slidesReset", a),
								a.forEach(function (a) {
									this._registerWithSlide(a),
									a.get("active") ? (a.trigger("change:active", a, !0), a.trigger("change:selected", a, !0), this._selectionChanged(a, !0)) : a.get("selected") && a.set("selected", !1)
								}, this)
							},
							_slideActivated : function (a, b, c) {
								b && this.set("activeSlide", a, c)
							},
							selectSlides : function (a, b) {
								a = _.isArray(a) ? a : [a],
								a.length && (b = b || a[0], this.get("slides").forEach(function (a) {
										return a.set("selected", !1)
									}), b.set("active", !0, {
										multiselect : !0
									}), a.forEach(function (a) {
										a.set("selected", !0, {
											multiselect : !0
										})
									}))
							},
							unselectSlides : function (a, b) {
								a = a || this.get("slides").models,
								a = _.isArray(a) ? a : [a],
								a.forEach(function (a) {
									(b || !a.get("active")) && a.set("selected", !1)
								})
							},
							_selectionChanged : function (a, b, c) {
								c = c || {};
								var d = c.multiselect || f.pressed.ctrl || f.pressed.meta || f.pressed.shift;
								if (b)
									d || this.get("slides").forEach(function (b) {
										a !== b && b.set("selected", !1)
									}), -1 == this.selected.indexOf(a) && (this.selected.push(a), this._sortSelectedSlides());
								else {
									var e = this.selected.indexOf(a);
									-1 !== e && (this.selected.splice(e, 1), this._sortSelectedSlides())
								}
							},
							_sortSelectedSlides : function () {
								this.selected.sort(function (a, b) {
									return a.get("index") - b.get("index")
								})
							},
							_registerWithSlide : function (a) {
								a.on("change:active", this._slideActivated, this),
								a.on("change:selected", this._selectionChanged, this),
								a.on("dispose", this._slideDisposed, this)
							},
							create : function (a) {
								this.undoHistory.pushdo(new c.Add(this, null, a))
							},
							add : function (a, b) {
								this.undoHistory.pushdo(new c.Add(this, a, b))
							},
							_doAdd : function (a, b) {
								var c = this.get("slides");
								if (a = a || [new e], a = _.isArray(a) ? a : [a], b = b || {}, !b.preserveIndexes && this.selected.length)
									var d = c.indexOf(this.selected[this.selected.length - 1]);
								for (var f = 0; f < a.length; f++) {
									var g = a[f];
									g.on("unrender", g.unrendered, g),
									b.at = _.isNumber(b.at) ? b.at + f : (b.preserveIndexes ? g.get("index") : d + 1 + f) || 0,
									c.add(g, b)
								}
								this.selectSlides(a)
							},
							remove : function (a) {
								a = _.isArray(a) ? a : [a],
								this.undoHistory.pushdo(new c.Remove(this, a))
							},
							_doRemove : function (a, b) {
								a = _.isArray(a) ? a : [a];
								var c = this.get("slides"),
								d = a.slice(0).reverse();
								d.forEach(function (a) {
									c.remove(a, b),
									a.off(),
									a.dispose()
								})
							},
							undo : function () {
								this.undoHistory.undo()
							},
							redo : function () {
								this.undoHistory.redo()
							}
						})
					}), function () {
					function a(a) {
						this.tokens = [],
						this.tokens.links = {},
						this.options = a || h.defaults,
						this.rules = i.normal,
						this.options.gfm && (this.rules = this.options.tables ? i.tables : i.gfm)
					}
					function b(a, b) {
						if (this.options = b || h.defaults, this.links = a, this.rules = j.normal, !this.links)
							throw new Error("Tokens array requires a `links` property.");
						this.options.gfm ? this.rules = this.options.breaks ? j.breaks : j.gfm : this.options.pedantic && (this.rules = j.pedantic)
					}
					function c(a) {
						this.tokens = [],
						this.token = null,
						this.options = a || h.defaults
					}
					function d(a, b) {
						return a.replace(b ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
					}
					function e(a, b) {
						return a = a.source,
						b = b || "",
						function c(d, e) {
							return d ? (e = e.source || e, e = e.replace(/(^|[^\[])\^/g, "$1"), a = a.replace(d, e), c) : new RegExp(a, b)
						}
					}
					function f() {}

					function g(a) {
						for (var b, c, d = 1; d < arguments.length; d++) {
							b = arguments[d];
							for (c in b)
								Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c])
						}
						return a
					}
					function h(b, e, f) {
						if (f || "function" == typeof e) {
							f || (f = e, e = null),
							e = g({}, h.defaults, e || {});
							var i,
							j,
							k = e.highlight,
							l = 0;
							try {
								i = a.lex(b, e)
							} catch (m) {
								return f(m)
							}
							j = i.length;
							var n = function () {
								var a,
								b;
								try {
									a = c.parse(i, e)
								} catch (d) {
									b = d
								}
								return e.highlight = k,
								b ? f(b) : f(null, a)
							};
							if (!k || k.length < 3)
								return n();
							if (delete e.highlight, !j)
								return n();
							for (; l < i.length; l++)
								!function (a) {
									return "code" !== a.type ? --j || n() : k(a.text, a.lang, function (b, c) {
										return null == c || c === a.text ? --j || n() : (a.text = c, a.escaped = !0, --j || n(), void 0)
									})
								}
							(i[l])
						} else
							try {
								return e && (e = g({}, h.defaults, e)),
								c.parse(a.lex(b, e), e)
							} catch (m) {
								if (m.message += "\nPlease report this to https://github.com/chjj/marked.", (e || h.defaults).silent)
									return "<p>An error occured:</p><pre>" + d(m.message + "", !0) + "</pre>";
								throw m
							}
					}
					var i = {
						newline : /^\n+/,
						code : /^( {4}[^\n]+\n*)+/,
						fences : f,
						hr : /^( *[-*_]){3,} *(?:\n+|$)/,
						heading : /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
						nptable : f,
						lheading : /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
						blockquote : /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
						list : /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
						html : /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
						def : /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
						table : f,
						paragraph : /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
						text : /^[^\n]+/
					};
					i.bullet = /(?:[*+-]|\d+\.)/,
					i.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,
					i.item = e(i.item, "gm")(/bull/g, i.bullet)(),
					i.list = e(i.list)(/bull/g, i.bullet)("hr", /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)(),
					i._tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b",
					i.html = e(i.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, i._tag)(),
					i.paragraph = e(i.paragraph)("hr", i.hr)("heading", i.heading)("lheading", i.lheading)("blockquote", i.blockquote)("tag", "<" + i._tag)("def", i.def)(),
					i.normal = g({}, i),
					i.gfm = g({}, i.normal, {
							fences : /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
							paragraph : /^/
						}),
					i.gfm.paragraph = e(i.paragraph)("(?!", "(?!" + i.gfm.fences.source.replace("\\1", "\\2") + "|" + i.list.source.replace("\\1", "\\3") + "|")(),
					i.tables = g({}, i.gfm, {
							nptable : /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
							table : /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
						}),
					a.rules = i,
					a.lex = function (b, c) {
						var d = new a(c);
						return d.lex(b)
					},
					a.prototype.lex = function (a) {
						return a = a.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n"),
						this.token(a, !0)
					},
					a.prototype.token = function (a, b) {
						for (var c, d, e, f, g, h, j, k, l, a = a.replace(/^ +$/gm, ""); a; )
							if ((e = this.rules.newline.exec(a)) && (a = a.substring(e[0].length), e[0].length > 1 && this.tokens.push({
										type : "space"
									})), e = this.rules.code.exec(a))
								a = a.substring(e[0].length), e = e[0].replace(/^ {4}/gm, ""), this.tokens.push({
									type : "code",
									text : this.options.pedantic ? e : e.replace(/\n+$/, "")
								});
							else if (e = this.rules.fences.exec(a))
								a = a.substring(e[0].length), this.tokens.push({
									type : "code",
									lang : e[2],
									text : e[3]
								});
							else if (e = this.rules.heading.exec(a))
								a = a.substring(e[0].length), this.tokens.push({
									type : "heading",
									depth : e[1].length,
									text : e[2]
								});
							else if (b && (e = this.rules.nptable.exec(a))) {
								for (a = a.substring(e[0].length), h = {
										type : "table",
										header : e[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
										align : e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
										cells : e[3].replace(/\n$/, "").split("\n")
									}, k = 0; k < h.align.length; k++)
									h.align[k] = /^ *-+: *$/.test(h.align[k]) ? "right" : /^ *:-+: *$/.test(h.align[k]) ? "center" : /^ *:-+ *$/.test(h.align[k]) ? "left" : null;
								for (k = 0; k < h.cells.length; k++)
									h.cells[k] = h.cells[k].split(/ *\| */);
								this.tokens.push(h)
							} else if (e = this.rules.lheading.exec(a))
								a = a.substring(e[0].length), this.tokens.push({
									type : "heading",
									depth : "=" === e[2] ? 1 : 2,
									text : e[1]
								});
							else if (e = this.rules.hr.exec(a))
								a = a.substring(e[0].length), this.tokens.push({
									type : "hr"
								});
							else if (e = this.rules.blockquote.exec(a))
								a = a.substring(e[0].length), this.tokens.push({
									type : "blockquote_start"
								}), e = e[0].replace(/^ *> ?/gm, ""), this.token(e, b), this.tokens.push({
									type : "blockquote_end"
								});
							else if (e = this.rules.list.exec(a)) {
								for (a = a.substring(e[0].length), f = e[2], this.tokens.push({
										type : "list_start",
										ordered : f.length > 1
									}), e = e[0].match(this.rules.item), c = !1, l = e.length, k = 0; l > k; k++)
									h = e[k], j = h.length, h = h.replace(/^ *([*+-]|\d+\.) +/, ""), ~h.indexOf("\n ") && (j -= h.length, h = this.options.pedantic ? h.replace(/^ {1,4}/gm, "") : h.replace(new RegExp("^ {1," + j + "}", "gm"), "")), this.options.smartLists && k !== l - 1 && (g = i.bullet.exec(e[k + 1])[0], f === g || f.length > 1 && g.length > 1 || (a = e.slice(k + 1).join("\n") + a, k = l - 1)), d = c || /\n\n(?!\s*$)/.test(h), k !== l - 1 && (c = "\n" === h.charAt(h.length - 1), d || (d = c)), this.tokens.push({
										type : d ? "loose_item_start" : "list_item_start"
									}), this.token(h, !1), this.tokens.push({
										type : "list_item_end"
									});
								this.tokens.push({
									type : "list_end"
								})
							} else if (e = this.rules.html.exec(a))
								a = a.substring(e[0].length), this.tokens.push({
									type : this.options.sanitize ? "paragraph" : "html",
									pre : "pre" === e[1] || "script" === e[1] || "style" === e[1],
									text : e[0]
								});
							else if (b && (e = this.rules.def.exec(a)))
								a = a.substring(e[0].length), this.tokens.links[e[1].toLowerCase()] = {
									href : e[2],
									title : e[3]
								};
							else if (b && (e = this.rules.table.exec(a))) {
								for (a = a.substring(e[0].length), h = {
										type : "table",
										header : e[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
										align : e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
										cells : e[3].replace(/(?: *\| *)?\n$/, "").split("\n")
									}, k = 0; k < h.align.length; k++)
									h.align[k] = /^ *-+: *$/.test(h.align[k]) ? "right" : /^ *:-+: *$/.test(h.align[k]) ? "center" : /^ *:-+ *$/.test(h.align[k]) ? "left" : null;
								for (k = 0; k < h.cells.length; k++)
									h.cells[k] = h.cells[k].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
								this.tokens.push(h)
							} else if (b && (e = this.rules.paragraph.exec(a)))
								a = a.substring(e[0].length), this.tokens.push({
									type : "paragraph",
									text : "\n" === e[1].charAt(e[1].length - 1) ? e[1].slice(0, -1) : e[1]
								});
							else if (e = this.rules.text.exec(a))
								a = a.substring(e[0].length), this.tokens.push({
									type : "text",
									text : e[0]
								});
							else if (a)
								throw new Error("Infinite loop on byte: " + a.charCodeAt(0));
						return this.tokens
					};
					var j = {
						escape : /^\\([\\`*{}\[\]()#+\-.!_>])/,
						autolink : /^<([^ >]+(@|:\/)[^ >]+)>/,
						url : f,
						tag : /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
						link : /^!?\[(inside)\]\(href\)/,
						reflink : /^!?\[(inside)\]\s*\[([^\]]*)\]/,
						nolink : /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
						strong : /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
						em : /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
						code : /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
						br : /^ {2,}\n(?!\s*$)/,
						del : f,
						text : /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
					};
					j._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,
					j._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,
					j.link = e(j.link)("inside", j._inside)("href", j._href)(),
					j.reflink = e(j.reflink)("inside", j._inside)(),
					j.normal = g({}, j),
					j.pedantic = g({}, j.normal, {
							strong : /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
							em : /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
						}),
					j.gfm = g({}, j.normal, {
							escape : e(j.escape)("])", "~|])")(),
							url : /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
							del : /^~~(?=\S)([\s\S]*?\S)~~/,
							text : e(j.text)("]|", "~]|")("|", "|https?://|")()
						}),
					j.breaks = g({}, j.gfm, {
							br : e(j.br)("{2,}", "*")(),
							text : e(j.gfm.text)("{2,}", "*")()
						}),
					b.rules = j,
					b.output = function (a, c, d) {
						var e = new b(c, d);
						return e.output(a)
					},
					b.prototype.output = function (a) {
						for (var b, c, e, f, g = ""; a; )
							if (f = this.rules.escape.exec(a))
								a = a.substring(f[0].length), g += f[1];
							else if (f = this.rules.autolink.exec(a))
								a = a.substring(f[0].length), "@" === f[2] ? (c = ":" === f[1].charAt(6) ? this.mangle(f[1].substring(7)) : this.mangle(f[1]), e = this.mangle("mailto:") + c) : (c = d(f[1]), e = c), g += '<a href="' + e + '">' + c + "</a>";
							else if (f = this.rules.url.exec(a))
								a = a.substring(f[0].length), c = d(f[1]), e = c, g += '<a href="' + e + '">' + c + "</a>";
							else if (f = this.rules.tag.exec(a))
								a = a.substring(f[0].length), g += this.options.sanitize ? d(f[0]) : f[0];
							else if (f = this.rules.link.exec(a))
								a = a.substring(f[0].length), g += this.outputLink(f, {
									href : f[2],
									title : f[3]
								});
							else if ((f = this.rules.reflink.exec(a)) || (f = this.rules.nolink.exec(a))) {
								if (a = a.substring(f[0].length), b = (f[2] || f[1]).replace(/\s+/g, " "), b = this.links[b.toLowerCase()], !b || !b.href) {
									g += f[0].charAt(0),
									a = f[0].substring(1) + a;
									continue
								}
								g += this.outputLink(f, b)
							} else if (f = this.rules.strong.exec(a))
								a = a.substring(f[0].length), g += "<strong>" + this.output(f[2] || f[1]) + "</strong>";
							else if (f = this.rules.em.exec(a))
								a = a.substring(f[0].length), g += "<em>" + this.output(f[2] || f[1]) + "</em>";
							else if (f = this.rules.code.exec(a))
								a = a.substring(f[0].length), g += "<code>" + d(f[2], !0) + "</code>";
							else if (f = this.rules.br.exec(a))
								a = a.substring(f[0].length), g += "<br>";
							else if (f = this.rules.del.exec(a))
								a = a.substring(f[0].length), g += "<del>" + this.output(f[1]) + "</del>";
							else if (f = this.rules.text.exec(a))
								a = a.substring(f[0].length), g += d(this.smartypants(f[0]));
							else if (a)
								throw new Error("Infinite loop on byte: " + a.charCodeAt(0));
						return g
					},
					b.prototype.outputLink = function (a, b) {
						return "!" !== a[0].charAt(0) ? '<a href="' + d(b.href) + '"' + (b.title ? ' title="' + d(b.title) + '"' : "") + ">" + this.output(a[1]) + "</a>" : '<img src="' + d(b.href) + '" alt="' + d(a[1]) + '"' + (b.title ? ' title="' + d(b.title) + '"' : "") + ">"
					},
					b.prototype.smartypants = function (a) {
						return this.options.smartypants ? a.replace(/--/g, "—").replace(/(^|[-\u2014/( \ [{
									"\s])'/g," $1‘ ").replace(/'/g," ’ ").replace(/(^|[-\u2014/(\[{\u2018\s])" / g,
									"$1“").replace(/"/g, "”").replace(/\.{3}/g, "…") : a
								}, b.prototype.mangle = function (a) {
									for (var b, c = "", d = a.length, e = 0; d > e; e++)
										b = a.charCodeAt(e), Math.random() > .5 && (b = "x" + b.toString(16)), c += "&#" + b + ";";
									return c
								}, c.parse = function (a, b) {
									var d = new c(b);
									return d.parse(a)
								}, c.prototype.parse = function (a) {
									this.inline = new b(a.links, this.options),
									this.tokens = a.reverse();
									for (var c = ""; this.next(); )
										c += this.tok();
									return c
								}, c.prototype.next = function () {
									return this.token = this.tokens.pop()
								}, c.prototype.peek = function () {
									return this.tokens[this.tokens.length - 1] || 0
								}, c.prototype.parseText = function () {
									for (var a = this.token.text; "text" === this.peek().type; )
										a += "\n" + this.next().text;
									return this.inline.output(a)
								}, c.prototype.tok = function () {
									switch (this.token.type) {
									case "space":
										return "";
									case "hr":
										return "<hr>\n";
									case "heading":
										return "<h" + this.token.depth + ' id="' + this.token.text.toLowerCase().replace(/[^\w]+/g, "-") + '">' + this.inline.output(this.token.text) + "</h" + this.token.depth + ">\n";
									case "code":
										if (this.options.highlight) {
											var a = this.options.highlight(this.token.text, this.token.lang);
											null != a && a !== this.token.text && (this.token.escaped = !0, this.token.text = a)
										}
										return this.token.escaped || (this.token.text = d(this.token.text, !0)),
										"<pre><code" + (this.token.lang ? ' class="' + this.options.langPrefix + this.token.lang + '"' : "") + ">" + this.token.text + "</code></pre>\n";
									case "table":
										var b,
										c,
										e,
										f,
										g,
										h = "";
										for (h += "<thead>\n<tr>\n", c = 0; c < this.token.header.length; c++)
											b = this.inline.output(this.token.header[c]), h += "<th", this.token.align[c] && (h += ' style="text-align:' + this.token.align[c] + '"'), h += ">" + b + "</th>\n";
										for (h += "</tr>\n</thead>\n", h += "<tbody>\n", c = 0; c < this.token.cells.length; c++) {
											for (e = this.token.cells[c], h += "<tr>\n", g = 0; g < e.length; g++)
												f = this.inline.output(e[g]), h += "<td", this.token.align[g] && (h += ' style="text-align:' + this.token.align[g] + '"'), h += ">" + f + "</td>\n";
											h += "</tr>\n"
										}
										return h += "</tbody>\n",
										"<table>\n" + h + "</table>\n";
									case "blockquote_start":
										for (var h = ""; "blockquote_end" !== this.next().type; )
											h += this.tok();
										return "<blockquote>\n" + h + "</blockquote>\n";
									case "list_start":
										for (var i = this.token.ordered ? "ol" : "ul", h = ""; "list_end" !== this.next().type; )
											h += this.tok();
										return "<" + i + ">\n" + h + "</" + i + ">\n";
									case "list_item_start":
										for (var h = ""; "list_item_end" !== this.next().type; )
											h += "text" === this.token.type ? this.parseText() : this.tok();
										return "<li>" + h + "</li>\n";
									case "loose_item_start":
										for (var h = ""; "list_item_end" !== this.next().type; )
											h += this.tok();
										return "<li>" + h + "</li>\n";
									case "html":
										return this.token.pre || this.options.pedantic ? this.token.text : this.inline.output(this.token.text);
									case "paragraph":
										return "<p>" + this.inline.output(this.token.text) + "</p>\n";
									case "text":
										return "<p>" + this.parseText() + "</p>\n"
									}
								}, f.exec = f, h.options = h.setOptions = function (a) {
									return g(h.defaults, a),
									h
								}, h.defaults = {
									gfm : !0,
									tables : !0,
									breaks : !1,
									pedantic : !1,
									sanitize : !1,
									smartLists : !1,
									silent : !1,
									highlight : null,
									langPrefix : "lang-",
									smartypants : !1
								}, h.Parser = c, h.parser = c.parse, h.Lexer = a, h.lexer = a.lex, h.InlineLexer = b, h.inlineLexer = b.output, h.parse = h, "object" == typeof exports ? module.exports = h : "function" == typeof define && define.amd ? define("marked", [], function () {
										return h
									}) : this.marked = h
							}
							.call(function () {
								return this || ("undefined" != typeof window ? window : global)
							}
								()),
							define("strut/presentation_generator/impress/ImpressGenerator", ["handlebars", "common/Math2", "marked", "strut/deck/Utils"], function (a, b, c, d) {
								var e,
								f = window.config.slide;
								return e = function () {
									function e() {
										var e = this;
										a.registerHelper("renderComponent", function (b, c) {
											var d;
											if (d = "", c && "string" == typeof c && (c = c.split(" "), -1 != c.indexOf(b.get("type"))))
												return d;
											switch (b.get("type")) {
											case "Image":
												d = "SVG" === b.get("imageType") ? JST["strut.presentation_generator.impress/SVGImage"](b.attributes) : JST["strut.presentation_generator.impress/Image"](b.attributes);
												break;
											case "TextBox":
												d = JST["strut.presentation_generator.impress/TextBox"](e.convertTextBoxData(b.attributes));
												break;
											case "Video":
												d = "html5" === b.get("videoType") ? JST["strut.presentation_generator.impress/Video"](b.attributes) : JST["strut.presentation_generator.impress/Youtube"](b.attributes);
												break;
											case "WebFrame":
												d = JST["strut.presentation_generator.impress/WebFrame"](b.attributes)
											}
											return new a.SafeString(d)
										}),
										a.registerHelper("scaleX", function (a) {
											return a * f.size.width / f.overviewSize.width
										}),
										a.registerHelper("scaleY", function (a) {
											return a * f.size.height / f.overviewSize.height
										}),
										a.registerHelper("toDeg", function (a) {
											return 180 * a / Math.PI
										}),
										a.registerHelper("negate", function (a) {
											return -1 * a
										}),
										a.registerHelper("round", function (a) {
											return b.round(a, 2)
										}),
										a.registerHelper("extractBG", function (a) {
											var b,
											c,
											d,
											e,
											f,
											g;
											if (null != a && a.length > 0) {
												for (d = "", e = a[0], b = ["-moz-", "-webkit-", "-o-", "-ms-", ""], f = 0, g = b.length; g > f; f++)
													c = b[f], d += "background-image: " + c + e + "; ";
												return d
											}
											return ""
										}),
										a.registerHelper("or", function (a, b) {
											return a || b
										}),
										a.registerHelper("determineBG", function (a, b) {
											var c = d.slideBackground(a, b, {
													surfaceForDefault : !0,
													transparentForSurface : !0
												});
											return c && 0 == c.indexOf("img:") ? "" : c
										}),
										a.registerHelper("determineSurface", function (a, b) {
											var c = d.slideSurface(a, b);
											return c && "bg-default" != c && -1 == c.indexOf("img:") ? " " + c + " " : ""
										}),
										a.registerHelper("slideBGImg", function (a) {
											var b = a.get("background");
											return b && 0 == b.indexOf("img:") ? "background-image: url(" + b.substring(4) + ");" : ""
										}),
										a.registerHelper("marked", function (b) {
											return b ? new a.SafeString(c(b)) : ""
										}),
										a.registerHelper("isBGImg", function (a, b) {
											return a && 0 == a.indexOf("img:") ? b.fn(this) : b.inverse(this)
										}),
										a.registerHelper("isBGClass", function (a, b) {
											return a && 0 == a.indexOf("img:") ? b.inverse(this) : b.fn(this)
										}),
										a.registerHelper("getBGImgStyle", function (a) {
											return "background-image: url(" + a.substring(4) + ");"
										});
										var g = {};
										a.registerHelper("counter_set", function (a, b) {
											g[a] = b
										}),
										a.registerHelper("counter_incAndGet", function (a) {
											return g[a] = g[a] + 1
										}),
										a.registerPartial("ComponentContainer", JST["strut.presentation_generator.impress/ComponentContainer"]),
										a.registerPartial("TransformContainer", JST["strut.presentation_generator.impress/TransformContainer"]),
										a.registerPartial("SVGContainer", JST["strut.presentation_generator.impress/SVGContainer"]),
										a.registerPartial("PerSlideSurfaceStylesheet", JST["strut.presentation_generator/PerSlideSurfaceStylesheet"]),
										a.registerPartial("CustomBgStylesheet", JST["strut.presentation_generator/CustomBgStylesheet"])
									}
									return e.prototype.render = function (a) {
										var b,
										c,
										d,
										e = a.attributes;
										d = e.slides,
										c = 6,
										b = 0;
										var f,
										g,
										h,
										i;
										return d.each(function (a) {
											var d;
											return d = a.get("x"),
											y = a.get("y"),
											null == d && (a.set("x", 280 * b + 180), a.set("y", 280 * (0 | b / c) + 180)),
											(null == f || f > d) && (f = d),
											(null == g || g > y) && (g = y),
											(null == h || d > h) && (h = d),
											(null == i || y > i) && (i = y),
											++b
										}),
										e.overviewX = (h + f) / 2,
										e.overviewY = (i + g) / 2,
										JST["strut.presentation_generator.impress/ImpressTemplate"](a)
									},
									e.prototype.getStartPreviewFn = function (a, b, c) {
										function d() {
											console.log("Loaded!"),
											window.location.hash = "#/step-" + (a.activeSlideIndex() + 1),
											b.previewWind.document.open(),
											b.previewWind.document.write(c),
											b.previewWind.document.close()
										}
										return d
									},
									e.prototype.convertTextBoxData = function (b) {
										var c;
										return c = _.extend({}, b),
										c.text = new a.SafeString(b.text),
										c
									},
									e
								}
								(),
								new e
							}),
							define("strut/exporter/zip/browser/Archiver", ["libs/jszip", "strut/deck/Deck", "strut/presentation_generator/impress/ImpressGenerator", "common/FileUtils"], function (a, b, c, d) {
								var e,
								f;
								return f = {
									includeImages : !0,
									includeFonts : !0
								},
								e = function () {
									function e(a, b) {
										this.presentation = a,
										this.options = b,
										this.options || (this.options = {}),
										this.canvas = $("<canvas></canvas>")[0],
										this._archivedImages = {},
										this._imageIdx = 0,
										_.defaults(this.options, f)
									}
									return e.prototype.create = function () {
										var d,
										e,
										f = this;
										return this.archive = new a,
										this.previewExportDir = this.archive.folder("preview_export"),
										this.imagesDir = this.previewExportDir.folder("images"),
										this.scriptsDir = this.previewExportDir.folder("scripts"),
										this.fontsDir = this.previewExportDir.folder("fonts"),
										this.cssDir = this.previewExportDir.folder("css"),
										d = new b,
										d["import"](this.presentation.toJSON(!1, !0)),
										d.get("slides").each(function (a) {
											return f.processComponents(a.get("components"))
										}),
										e = "<!doctype html><html>" + c.render(d.attributes) + "</html>",
										this._archiveIndexHtml(e),
										this._archiveScripts(),
										this._archiveFonts(),
										this._archiveCss(),
										this._archivedImages = {},
										this.archive.generate()
									},
									e.prototype.createSimple = function (b, d) {
										var e,
										f = this;
										return this.archive = new a,
										this.previewExportDir = this.archive.folder("preview_export"),
										this.scriptsDir = this.previewExportDir.folder("scripts"),
										this.cssDir = this.previewExportDir.folder("css"),
										e = "<!doctype html><html>" + c.render(this.presentation.attributes) + "</html>",
										this._archiveIndexHtml(e),
										this._archiveScripts(function () {
											return f._archiveCss(function () {
												return b(f.archive.generate(d))
											})
										})
									},
									e.prototype.processComponents = function (a) {
										var b = this;
										return a.forEach(function (a) {
											return b.processComponent(a)
										})
									},
									e.prototype.processComponent = function (a) {
										return "ImageModel" === a.get("type") && this.options.includeImages ? this._archiveImage(a) : void 0
									},
									e.prototype._archiveIndexHtml = function (a) {
										return this.archive.file("index.html", a)
									},
									e.prototype._archiveScripts = function (a) {
										var b = this;
										return $.get("preview_export/scripts/impress.js", function (c) {
											return b.scriptsDir.file("impress.js", c),
											a()
										})
									},
									e.prototype._archiveFonts = function () {},
									e.prototype._archiveCss = function (a) {
										var b = this;
										return $.get("zip/main.css", function (c) {
											return b.cssDir.file("main.css", c),
											a()
										})
									},
									e.prototype._archiveImage = function (a) {
										var b,
										c;
										return this._archivedImages[a.get("src")] ? void 0 : (this._archivedImages[a.get("src")] = !0, c = a.cachedImage, this.canvas.width = c.naturalWidth, this.canvas.height = c.naturalHeight, this.canvas.getContext("2d").drawImage(c, 0, 0), b = this._imageIdx + d.baseName(a.get("src")), this.imagesDir.file(b, this.canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, ""), {
												base64 : !0
											}), a.set("src", "preview_export/images/" + b))
									},
									e
								}
								()
							}),
							define("strut/exporter/zip/browser/View", ["libs/backbone", "./Archiver", "lang"], function (a, b) {
								return a.View.extend({
									name : "Zip",
									initialize : function () {
										this.$el.html('<div class="alert alert-info">The most effective way to archive your rendered presentation is to:<p><ol><li>Click <code>Present</code></li><li>Press <code>Ctrl+S</code>(windows) or <code>⌘+S</code>(Mac) to save the entire presentation to disk.</li></ol></p>')
									},
									show : function (a, b) {
										this._$modal = b;
										var c = this._$modal.find(".ok");
										c.html(""),
										a.append(this.$el)
									},
									_makeDownloadable : function (a) {
										var c = new b(this._exportable.adapted.deck()),
										d = this;
										c.createSimple(function (b) {
											var c = a[0];
											c.href = window.URL.createObjectURL(b),
											c.download = d._exportable.identifier() + ".zip",
											c.dataset.downloadurl = ["application/json", c.download, c.href].join(":")
										}, {
											type : "blob"
										})
									},
									hide : function () {
										this.$el.detach(),
										this.hidden()
									},
									hidden : function () {
										this._$modal.find(".ok")
									},
									render : function () {
										return this.$el.html("Zipping while running Strut from file:// URLs is currently not supported due to browser security restrictions.  The best way zip your presentation in this case is to:<br/><ol><li>Click Preview, then</li><li>Use your browser's <code>Save Page As</code> functionality<br/>to save the entire presentation to disk.</li></ol>"),
										this
									},
									constructor : function (b) {
										this._exportable = b,
										a.View.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/exporter/zip/browser/main", ["./View"], function (a) {
								"use strict";
								var b = {
									createView : function (b) {
										return new a(b.exportable)
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : "strut.exporter"
										}, b)
									}
								}
							}),
							define("strut/importer/json/main", ["common/FileUtils"], function (a) {
								"use strict";
								var b = {
									"import" : function (b, c, d) {
										"text/json" == b.type || "" == b.type || "application/json" == b.type ? a.toText(b, function (a) {
											c.importPresentation(JSON.parse(a))
										}) : d()
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : "strut.importer"
										}, b)
									}
								}
							}),
							define("tantaman/web/widgets/HiddenOpen", ["libs/backbone"], function (a) {
								return a.View.extend({
									className : "dispNone",
									events : {
										"change input[type='file']" : "_fileChosen"
									},
									initialize : function (a, b) {
										return this._cb = b,
										null != a ? a.on("click", this.trigger.bind(this)) : void 0
									},
									trigger : function (a) {
										return null != a && (this._cb = a),
										this.$input.click()
									},
									_fileChosen : function (a) {
										var b;
										return b = a.target.files[0],
										this._cb(b)
									},
									render : function () {
										return this.$input = $('<input type="file"></input>'),
										this.$el.html(this.$input),
										this
									}
								})
							}),
							define("framework/Iterator", [], function () {
								function a(a) {
									return Array.isArray(a) || a instanceof Array ? new b(a) : new c(a)
								}
								function b(a) {
									this._val = a,
									this._crsr = 0
								}
								function c(a) {
									this._object = a,
									this._iter = new b(Object.keys(a))
								}
								return b.prototype = {
									next : function () {
										return this._val[this._crsr++]
									},
									hasNext : function () {
										return this._crsr < this._val.length
									}
								},
								c.prototype = {
									next : function () {
										return this._object[this._iter.next()]
									},
									hasNext : function () {
										return this._iter.hasNext()
									}
								},
								a
							}),
							define("strut/importer/main", ["tantaman/web/widgets/MenuItem", "framework/ServiceCollection", "tantaman/web/widgets/HiddenOpen", "framework/Iterator", "lang"], function (a, b, c, d, e) {
								"use strict";
								function f(a) {
									i.trigger(function (b) {
										g(b, a)
									})
								}
								function g(a, b) {
									function c() {
										e.hasNext() && e.next().import(a, b, c)
									}
									var e = new d(h);
									c()
								}
								var h = null,
								i = new c;
								$("body").append(i.render().$el);
								var j = {
									createMenuItems : function (b) {
										return new a({
											title : e.import,
											handler : f,
											model : b
										})
									}
								};
								return {
									initialize : function (a) {
										h = new b(a, "strut.importer", b.toServiceConverter),
										a.register({
											interfaces : "strut.LogoMenuItemProvider"
										}, j)
									}
								}
							}),
							define("tantaman/web/widgets/TabbedModal", ["libs/backbone"], function (a) {
								return a.View.extend({
									events : {
										hidden : "_hidden"
									},
									className : "tabbedModal modal hide",
									initialize : function () {},
									__template : function () {
										return JST["tantaman.web.widgets/TabbedModal"]
									},
									_providerSelected : function (a, b) {
										if (b) {
											var c = $(b.currentTarget);
											if (this.$lastProviderTab && this.$lastProviderTab[0] == c[0])
												return
										}
										this.$lastProviderTab && this.$lastProviderTab.removeClass("active"),
										this.$lastProviderTab = c,
										this.$lastProviderTab.addClass("active"),
										this.__currentProvider && this.__currentProvider.hide(),
										this.__currentProvider = this.__tabCollection[a],
										this.__providerSelected(this.__currentProvider, b),
										this.__currentProvider.show(this.$tabContent, this.$el)
									},
									__providerSelected : function () {},
									_hidden : function () {
										this.__currentProvider && this.__currentProvider.hidden()
									},
									show : function (a, b) {
										this.__cb = a,
										this.__$title.text(b),
										this.__currentProvider && this.__currentProvider.show(this.$tabContent, this.$el),
										this.$el.modal("show")
									},
									render : function () {
										this.$el.html(this.__template()(this.__tabCollection)),
										this.__$ok = this.$el.find(".ok"),
										this.__$title = this.$el.find(".title"),
										this.$tabContent = this.$el.find(".tabContent");
										var a = this,
										b = this.$el.find(".providerTab");
										return b.each(function (b) {
											var c = $(this);
											c.click(function (c) {
												a._providerSelected(b, c)
											})
										}),
										this.__tabCollection.length > 0 && a._providerSelected(0, {
											currentTarget : b[0]
										}),
										this
									},
									constructor : function (b) {
										this.__tabCollection = b,
										a.View.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/exporter/ExportImportModal", ["tantaman/web/widgets/TabbedModal"], function (a) {
								return a.extend({
									intialize : function () {},
									constructor : function (b, c) {
										var d = [];
										c.forEach(function (a) {
											d.push(a.createView(b))
										}),
										a.prototype.constructor.call(this, d)
									}
								})
							}),
							define("strut/exporter/main", ["tantaman/web/widgets/MenuItem", "framework/ServiceCollection", "./ExportImportModal", "lang"], function (a, b, c, d) {
								"use strict";
								var e = $("#modals"),
								f = null,
								g = null,
								h = {
									createMenuItems : function (b) {
										null == f && (f = new c(b, g), f.render(), e.append(f.$el));
										var h = new a({
												title : d.export,
												modal : f
											});
										return [h]
									}
								};
								return {
									initialize : function (a) {
										g = new b(a, "strut.exporter", b.toServiceConverter),
										a.register({
											interfaces : ["strut.LogoMenuItemProvider"]
										}, h),
										a.register({
											interfaces : "strut.exporter.Collection"
										}, g)
									}
								}
							}),
							define("strut/presentation_generator/impress/main", ["./ImpressGenerator"], function (a) {
								"use strict";
								var b = {
									displayName : "Impress",
									id : "impress",
									capabilities : {
										freeformStepping : !0
									},
									generate : function (b) {
										return a.render(b)
									},
									getSlideHash : function (a) {
										return "#/step-" + (a.activeSlideIndex() + 1)
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : "strut.presentation_generator"
										}, b)
									}
								}
							}),
							define("strut/presentation_generator/bespoke/BespokeGenerator", [], function () {
								return {
									render : function (a) {
										return JST["strut.presentation_generator.bespoke/BespokeTemplate"](a)
									},
									getStartPreviewFn : function (a, b, c) {
										function d() {
											var a = b.previewWind;
											a.document.open(),
											a.document.write(c),
											a.document.close()
										}
										return d
									},
									getSlideHash : function () {
										return ""
									}
								}
							}),
							define("strut/presentation_generator/bespoke/main", ["./BespokeGenerator"], function (a) {
								"use strict";
								var b = {
									displayName : "Bespoke",
									id : "bespoke",
									capabilities : {
										cannedTransitions : !0
									},
									generate : function (b) {
										return a.render(b)
									},
									getStartPreviewFn : function () {
										return a.getStartPreviewFn.apply(a, arguments)
									},
									getSlideHash : function (a) {
										return "#" + (a.activeSlideIndex() + 1)
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : "strut.presentation_generator"
										}, b)
									}
								}
							}),
							define("strut/presentation_generator/handouts/main", [], function () {
								"use strict";
								var a = {
									displayName : "Handouts",
									id : "handouts",
									generate : function (a) {
										return JST["strut.presentation_generator.handouts/HandoutsTemplate"](a)
									},
									getSlideHash : function () {
										return ""
									}
								};
								return {
									initialize : function (b) {
										b.register({
											interfaces : "strut.presentation_generator"
										}, a)
									}
								}
							}),
							define("strut/presentation_generator/main", ["framework/ServiceCollection"], function (a) {
								return {
									initialize : function (b) {
										var c = new a(b, "strut.presentation_generator", function (a) {
												return a.service()
											});
										b.register("strut.presentation_generator.GeneratorCollection", c)
									}
								}
							}),
							define("tantaman/web/saver/Saver", [], function () {
								"use strict";
								function a(a, b) {
									this.storageInterface = b,
									this.exportables = Array.isArray(a) ? a : [a]
								}
								return a.prototype = {
									__save : function () {
										this.exportables.forEach(function (a) {
											var b = a.export(),
											c = a.identifier();
											this.storageInterface.store(c, b)
										}, this)
									},
									save : function () {
										this.__save()
									}
								},
								a
							}),
							define("tantaman/web/saver/ExitSaver", ["./Saver"], function (a) {
								"use strict";
								function b() {
									a.apply(this, arguments),
									this._unloaded = this._unloaded.bind(this),
									$(window).unload(this._unloaded)
								}
								var c = b.prototype = Object.create(a.prototype);
								return c._unloaded = function () {
									this.__save()
								},
								c.dispose = function () {
									$(window).off("unload", this._unloaded)
								},
								b
							}),
							define("tantaman/web/saver/TimedSaver", ["./Saver"], function (a) {
								"use strict";
								function b(b, c, d) {
									a.call(this, b, d),
									this._intervalH = setInterval(this.__save.bind(this), c)
								}
								var c = b.prototype = Object.create(a.prototype);
								return c.dispose = function () {
									clearInterval(this._intervalH)
								},
								b
							}),
							define("tantaman/web/saver/main", ["./ExitSaver", "./TimedSaver", "./Saver"], function (a, b) {
								var c = {
									timedSaver : function (a, c, d) {
										return new b(a, c, d)
									},
									exitSaver : function (b, c) {
										return new a(b, c)
									},
									manualSaver : function (a, b) {
										return new Saver(a, b)
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : "tantaman.web.saver.AutoSavers"
										}, c)
									}
								}
							}),
							define("strut/slide_editor/model/SlideEditorModel", ["libs/backbone"], function (a) {
								return a.Model.extend({
									initialize : function () {
										this._editorModel.on("launch:preview", this._triggerSave, this),
										this._editorModel.on("change:modeId", this._triggerSave, this)
									},
									deck : function () {
										return this._editorModel.deck()
									},
									activeSlide : function () {
										return this._editorModel.deck().get("activeSlide")
									},
									isMarkdownMode : function () {
										return "markdown" == this.get("mode")
									},
									toggleMarkdown : function () {
										this.isMarkdownMode() ? this.set("mode", "preview") : this.set("mode", "markdown")
									},
									dispose : function () {
										this._editorModel.off(null, null, this),
										this.off()
									},
									_triggerSave : function () {
										this.trigger("saveEdits", null)
									},
									constructor : function (b) {
										this._editorModel = b.editorModel,
										a.Model.prototype.constructor.call(this)
									}
								})
							}),
							function (a, b) {
								function c(b, c) {
									var e,
									f,
									g,
									h = b.nodeName.toLowerCase();
									return "area" === h ? (e = b.parentNode, f = e.name, b.href && f && "map" === e.nodeName.toLowerCase() ? (g = a("img[usemap=#" + f + "]")[0], !!g && d(g)) : !1) : (/input|select|textarea|button|object/.test(h) ? !b.disabled : "a" === h ? b.href || c : c) && d(b)
								}
								function d(b) {
									return a.expr.filters.visible(b) && !a(b).parents().addBack().filter(function () {
										return "hidden" === a.css(this, "visibility")
									}).length
								}
								var e = 0,
								f = /^ui-id-\d+$/;
								a.ui = a.ui || {},
								a.extend(a.ui, {
									version : "1.10.3",
									keyCode : {
										BACKSPACE : 8,
										COMMA : 188,
										DELETE : 46,
										DOWN : 40,
										END : 35,
										ENTER : 13,
										ESCAPE : 27,
										HOME : 36,
										LEFT : 37,
										NUMPAD_ADD : 107,
										NUMPAD_DECIMAL : 110,
										NUMPAD_DIVIDE : 111,
										NUMPAD_ENTER : 108,
										NUMPAD_MULTIPLY : 106,
										NUMPAD_SUBTRACT : 109,
										PAGE_DOWN : 34,
										PAGE_UP : 33,
										PERIOD : 190,
										RIGHT : 39,
										SPACE : 32,
										TAB : 9,
										UP : 38
									}
								}),
								a.fn.extend({
									focus : function (b) {
										return function (c, d) {
											return "number" == typeof c ? this.each(function () {
												var b = this;
												setTimeout(function () {
													a(b).focus(),
													d && d.call(b)
												}, c)
											}) : b.apply(this, arguments)
										}
									}
									(a.fn.focus),
									scrollParent : function () {
										var b;
										return b = a.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
												return /(relative|absolute|fixed)/.test(a.css(this, "position")) && /(auto|scroll)/.test(a.css(this, "overflow") + a.css(this, "overflow-y") + a.css(this, "overflow-x"))
											}).eq(0) : this.parents().filter(function () {
												return /(auto|scroll)/.test(a.css(this, "overflow") + a.css(this, "overflow-y") + a.css(this, "overflow-x"))
											}).eq(0),
										/fixed/.test(this.css("position")) || !b.length ? a(document) : b
									},
									zIndex : function (c) {
										if (c !== b)
											return this.css("zIndex", c);
										if (this.length)
											for (var d, e, f = a(this[0]); f.length && f[0] !== document; ) {
												if (d = f.css("position"), ("absolute" === d || "relative" === d || "fixed" === d) && (e = parseInt(f.css("zIndex"), 10), !isNaN(e) && 0 !== e))
													return e;
												f = f.parent()
											}
										return 0
									},
									uniqueId : function () {
										return this.each(function () {
											this.id || (this.id = "ui-id-" + ++e)
										})
									},
									removeUniqueId : function () {
										return this.each(function () {
											f.test(this.id) && a(this).removeAttr("id")
										})
									}
								}),
								a.extend(a.expr[":"], {
									data : a.expr.createPseudo ? a.expr.createPseudo(function (b) {
										return function (c) {
											return !!a.data(c, b)
										}
									}) : function (b, c, d) {
										return !!a.data(b, d[3])
									},
									focusable : function (b) {
										return c(b, !isNaN(a.attr(b, "tabindex")))
									},
									tabbable : function (b) {
										var d = a.attr(b, "tabindex"),
										e = isNaN(d);
										return (e || d >= 0) && c(b, !e)
									}
								}),
								a("<a>").outerWidth(1).jquery || a.each(["Width", "Height"], function (c, d) {
									function e(b, c, d, e) {
										return a.each(f, function () {
											c -= parseFloat(a.css(b, "padding" + this)) || 0,
											d && (c -= parseFloat(a.css(b, "border" + this + "Width")) || 0),
											e && (c -= parseFloat(a.css(b, "margin" + this)) || 0)
										}),
										c
									}
									var f = "Width" === d ? ["Left", "Right"] : ["Top", "Bottom"],
									g = d.toLowerCase(),
									h = {
										innerWidth : a.fn.innerWidth,
										innerHeight : a.fn.innerHeight,
										outerWidth : a.fn.outerWidth,
										outerHeight : a.fn.outerHeight
									};
									a.fn["inner" + d] = function (c) {
										return c === b ? h["inner" + d].call(this) : this.each(function () {
											a(this).css(g, e(this, c) + "px")
										})
									},
									a.fn["outer" + d] = function (b, c) {
										return "number" != typeof b ? h["outer" + d].call(this, b) : this.each(function () {
											a(this).css(g, e(this, b, !0, c) + "px")
										})
									}
								}),
								a.fn.addBack || (a.fn.addBack = function (a) {
									return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
								}),
								a("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (a.fn.removeData = function (b) {
									return function (c) {
										return arguments.length ? b.call(this, a.camelCase(c)) : b.call(this)
									}
								}
									(a.fn.removeData)),
								a.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),
								a.support.selectstart = "onselectstart" in document.createElement("div"),
								a.fn.extend({
									disableSelection : function () {
										return this.bind((a.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (a) {
											a.preventDefault()
										})
									},
									enableSelection : function () {
										return this.unbind(".ui-disableSelection")
									}
								}),
								a.extend(a.ui, {
									plugin : {
										add : function (b, c, d) {
											var e,
											f = a.ui[b].prototype;
											for (e in d)
												f.plugins[e] = f.plugins[e] || [], f.plugins[e].push([c, d[e]])
										},
										call : function (a, b, c) {
											var d,
											e = a.plugins[b];
											if (e && a.element[0].parentNode && 11 !== a.element[0].parentNode.nodeType)
												for (d = 0; d < e.length; d++)
													a.options[e[d][0]] && e[d][1].apply(a.element, c)
										}
									},
									hasScroll : function (b, c) {
										if ("hidden" === a(b).css("overflow"))
											return !1;
										var d = c && "left" === c ? "scrollLeft" : "scrollTop",
										e = !1;
										return b[d] > 0 ? !0 : (b[d] = 1, e = b[d] > 0, b[d] = 0, e)
									}
								})
							}
							(jQuery),
							function (a, b) {
								var c = 0,
								d = Array.prototype.slice,
								e = a.cleanData;
								a.cleanData = function (b) {
									for (var c, d = 0; null != (c = b[d]); d++)
										try {
											a(c).triggerHandler("remove")
										} catch (f) {}

									e(b)
								},
								a.widget = function (b, c, d) {
									var e,
									f,
									g,
									h,
									i = {},
									j = b.split(".")[0];
									b = b.split(".")[1],
									e = j + "-" + b,
									d || (d = c, c = a.Widget),
									a.expr[":"][e.toLowerCase()] = function (b) {
										return !!a.data(b, e)
									},
									a[j] = a[j] || {},
									f = a[j][b],
									g = a[j][b] = function (a, b) {
										return this._createWidget ? (arguments.length && this._createWidget(a, b), void 0) : new g(a, b)
									},
									a.extend(g, f, {
										version : d.version,
										_proto : a.extend({}, d),
										_childConstructors : []
									}),
									h = new c,
									h.options = a.widget.extend({}, h.options),
									a.each(d, function (b, d) {
										return a.isFunction(d) ? (i[b] = function () {
											var a = function () {
												return c.prototype[b].apply(this, arguments)
											},
											e = function (a) {
												return c.prototype[b].apply(this, a)
											};
											return function () {
												var b,
												c = this._super,
												f = this._superApply;
												return this._super = a,
												this._superApply = e,
												b = d.apply(this, arguments),
												this._super = c,
												this._superApply = f,
												b
											}
										}
											(), void 0) : (i[b] = d, void 0)
									}),
									g.prototype = a.widget.extend(h, {
											widgetEventPrefix : f ? h.widgetEventPrefix : b
										}, i, {
											constructor : g,
											namespace : j,
											widgetName : b,
											widgetFullName : e
										}),
									f ? (a.each(f._childConstructors, function (b, c) {
											var d = c.prototype;
											a.widget(d.namespace + "." + d.widgetName, g, c._proto)
										}), delete f._childConstructors) : c._childConstructors.push(g),
									a.widget.bridge(b, g)
								},
								a.widget.extend = function (c) {
									for (var e, f, g = d.call(arguments, 1), h = 0, i = g.length; i > h; h++)
										for (e in g[h])
											f = g[h][e], g[h].hasOwnProperty(e) && f !== b && (c[e] = a.isPlainObject(f) ? a.isPlainObject(c[e]) ? a.widget.extend({}, c[e], f) : a.widget.extend({}, f) : f);
									return c
								},
								a.widget.bridge = function (c, e) {
									var f = e.prototype.widgetFullName || c;
									a.fn[c] = function (g) {
										var h = "string" == typeof g,
										i = d.call(arguments, 1),
										j = this;
										return g = !h && i.length ? a.widget.extend.apply(null, [g].concat(i)) : g,
										h ? this.each(function () {
											var d,
											e = a.data(this, f);
											return e ? a.isFunction(e[g]) && "_" !== g.charAt(0) ? (d = e[g].apply(e, i), d !== e && d !== b ? (j = d && d.jquery ? j.pushStack(d.get()) : d, !1) : void 0) : a.error("no such method '" + g + "' for " + c + " widget instance") : a.error("cannot call methods on " + c + " prior to initialization; " + "attempted to call method '" + g + "'")
										}) : this.each(function () {
											var b = a.data(this, f);
											b ? b.option(g || {})._init() : a.data(this, f, new e(g, this))
										}),
										j
									}
								},
								a.Widget = function () {},
								a.Widget._childConstructors = [],
								a.Widget.prototype = {
									widgetName : "widget",
									widgetEventPrefix : "",
									defaultElement : "<div>",
									options : {
										disabled : !1,
										create : null
									},
									_createWidget : function (b, d) {
										d = a(d || this.defaultElement || this)[0],
										this.element = a(d),
										this.uuid = c++,
										this.eventNamespace = "." + this.widgetName + this.uuid,
										this.options = a.widget.extend({}, this.options, this._getCreateOptions(), b),
										this.bindings = a(),
										this.hoverable = a(),
										this.focusable = a(),
										d !== this && (a.data(d, this.widgetFullName, this), this._on(!0, this.element, {
												remove : function (a) {
													a.target === d && this.destroy()
												}
											}), this.document = a(d.style ? d.ownerDocument : d.document || d), this.window = a(this.document[0].defaultView || this.document[0].parentWindow)),
										this._create(),
										this._trigger("create", null, this._getCreateEventData()),
										this._init()
									},
									_getCreateOptions : a.noop,
									_getCreateEventData : a.noop,
									_create : a.noop,
									_init : a.noop,
									destroy : function () {
										this._destroy(),
										this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(a.camelCase(this.widgetFullName)),
										this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"),
										this.bindings.unbind(this.eventNamespace),
										this.hoverable.removeClass("ui-state-hover"),
										this.focusable.removeClass("ui-state-focus")
									},
									_destroy : a.noop,
									widget : function () {
										return this.element
									},
									option : function (c, d) {
										var e,
										f,
										g,
										h = c;
										if (0 === arguments.length)
											return a.widget.extend({}, this.options);
										if ("string" == typeof c)
											if (h = {}, e = c.split("."), c = e.shift(), e.length) {
												for (f = h[c] = a.widget.extend({}, this.options[c]), g = 0; g < e.length - 1; g++)
													f[e[g]] = f[e[g]] || {},
												f = f[e[g]];
												if (c = e.pop(), d === b)
													return f[c] === b ? null : f[c];
												f[c] = d
											} else {
												if (d === b)
													return this.options[c] === b ? null : this.options[c];
												h[c] = d
											}
										return this._setOptions(h),
										this
									},
									_setOptions : function (a) {
										var b;
										for (b in a)
											this._setOption(b, a[b]);
										return this
									},
									_setOption : function (a, b) {
										return this.options[a] = b,
										"disabled" === a && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!b).attr("aria-disabled", b), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")),
										this
									},
									enable : function () {
										return this._setOption("disabled", !1)
									},
									disable : function () {
										return this._setOption("disabled", !0)
									},
									_on : function (b, c, d) {
										var e,
										f = this;
										"boolean" != typeof b && (d = c, c = b, b = !1),
										d ? (c = e = a(c), this.bindings = this.bindings.add(c)) : (d = c, c = this.element, e = this.widget()),
										a.each(d, function (d, g) {
											function h() {
												return b || f.options.disabled !== !0 && !a(this).hasClass("ui-state-disabled") ? ("string" == typeof g ? f[g] : g).apply(f, arguments) : void 0
											}
											"string" != typeof g && (h.guid = g.guid = g.guid || h.guid || a.guid++);
											var i = d.match(/^(\w+)\s*(.*)$/),
											j = i[1] + f.eventNamespace,
											k = i[2];
											k ? e.delegate(k, j, h) : c.bind(j, h)
										})
									},
									_off : function (a, b) {
										b = (b || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace,
										a.unbind(b).undelegate(b)
									},
									_delay : function (a, b) {
										function c() {
											return ("string" == typeof a ? d[a] : a).apply(d, arguments)
										}
										var d = this;
										return setTimeout(c, b || 0)
									},
									_hoverable : function (b) {
										this.hoverable = this.hoverable.add(b),
										this._on(b, {
											mouseenter : function (b) {
												a(b.currentTarget).addClass("ui-state-hover")
											},
											mouseleave : function (b) {
												a(b.currentTarget).removeClass("ui-state-hover")
											}
										})
									},
									_focusable : function (b) {
										this.focusable = this.focusable.add(b),
										this._on(b, {
											focusin : function (b) {
												a(b.currentTarget).addClass("ui-state-focus")
											},
											focusout : function (b) {
												a(b.currentTarget).removeClass("ui-state-focus")
											}
										})
									},
									_trigger : function (b, c, d) {
										var e,
										f,
										g = this.options[b];
										if (d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent)
											for (e in f)
												e in c || (c[e] = f[e]);
										return this.element.trigger(c, d),
										!(a.isFunction(g) && g.apply(this.element[0], [c].concat(d)) === !1 || c.isDefaultPrevented())
									}
								},
								a.each({
									show : "fadeIn",
									hide : "fadeOut"
								}, function (b, c) {
									a.Widget.prototype["_" + b] = function (d, e, f) {
										"string" == typeof e && (e = {
												effect : e
											});
										var g,
										h = e ? e === !0 || "number" == typeof e ? c : e.effect || c : b;
										e = e || {},
										"number" == typeof e && (e = {
												duration : e
											}),
										g = !a.isEmptyObject(e),
										e.complete = f,
										e.delay && d.delay(e.delay),
										g && a.effects && a.effects.effect[h] ? d[b](e) : h !== b && d[h] ? d[h](e.duration, e.easing, f) : d.queue(function (c) {
											a(this)[b](),
											f && f.call(d[0]),
											c()
										})
									}
								})
							}
							(jQuery),
							function (a) {
								var b = !1;
								a(document).mouseup(function () {
									b = !1
								}),
								a.widget("ui.mouse", {
									version : "1.10.3",
									options : {
										cancel : "input,textarea,button,select,option",
										distance : 1,
										delay : 0
									},
									_mouseInit : function () {
										var b = this;
										this.element.bind("mousedown." + this.widgetName, function (a) {
											return b._mouseDown(a)
										}).bind("click." + this.widgetName, function (c) {
											return !0 === a.data(c.target, b.widgetName + ".preventClickEvent") ? (a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation(), !1) : void 0
										}),
										this.started = !1
									},
									_mouseDestroy : function () {
										this.element.unbind("." + this.widgetName),
										this._mouseMoveDelegate && a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
									},
									_mouseDown : function (c) {
										if (!b) {
											this._mouseStarted && this._mouseUp(c),
											this._mouseDownEvent = c;
											var d = this,
											e = 1 === c.which,
											f = "string" == typeof this.options.cancel && c.target.nodeName ? a(c.target).closest(this.options.cancel).length : !1;
											return e && !f && this._mouseCapture(c) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
															d.mouseDelayMet = !0
														}, this.options.delay)), this._mouseDistanceMet(c) && this._mouseDelayMet(c) && (this._mouseStarted = this._mouseStart(c) !== !1, !this._mouseStarted) ? (c.preventDefault(), !0) : (!0 === a.data(c.target, this.widgetName + ".preventClickEvent") && a.removeData(c.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (a) {
													return d._mouseMove(a)
												}, this._mouseUpDelegate = function (a) {
													return d._mouseUp(a)
												}, a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), c.preventDefault(), b = !0, !0)) : !0
										}
									},
									_mouseMove : function (b) {
										return a.ui.ie && (!document.documentMode || document.documentMode < 9) && !b.button ? this._mouseUp(b) : this._mouseStarted ? (this._mouseDrag(b), b.preventDefault()) : (this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b)), !this._mouseStarted)
									},
									_mouseUp : function (b) {
										return a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate),
										this._mouseStarted && (this._mouseStarted = !1, b.target === this._mouseDownEvent.target && a.data(b.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(b)),
										!1
									},
									_mouseDistanceMet : function (a) {
										return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
									},
									_mouseDelayMet : function () {
										return this.mouseDelayMet
									},
									_mouseStart : function () {},
									_mouseDrag : function () {},
									_mouseStop : function () {},
									_mouseCapture : function () {
										return !0
									}
								})
							}
							(jQuery),
							function (a) {
								a.widget("ui.selectable", a.ui.mouse, {
									version : "1.10.3",
									options : {
										appendTo : "body",
										autoRefresh : !0,
										distance : 0,
										filter : "*",
										tolerance : "touch",
										selected : null,
										selecting : null,
										start : null,
										stop : null,
										unselected : null,
										unselecting : null
									},
									_create : function () {
										var b,
										c = this;
										this.element.addClass("ui-selectable"),
										this.dragged = !1,
										this.refresh = function () {
											b = a(c.options.filter, c.element[0]),
											b.addClass("ui-selectee"),
											b.each(function () {
												var b = a(this),
												c = b.offset();
												a.data(this, "selectable-item", {
													element : this,
													$element : b,
													left : c.left,
													top : c.top,
													right : c.left + b.outerWidth(),
													bottom : c.top + b.outerHeight(),
													startselected : !1,
													selected : b.hasClass("ui-selected"),
													selecting : b.hasClass("ui-selecting"),
													unselecting : b.hasClass("ui-unselecting")
												})
											})
										},
										this.refresh(),
										this.selectees = b.addClass("ui-selectee"),
										this._mouseInit(),
										this.helper = a("<div class='ui-selectable-helper'></div>")
									},
									_destroy : function () {
										this.selectees.removeClass("ui-selectee").removeData("selectable-item"),
										this.element.removeClass("ui-selectable ui-selectable-disabled"),
										this._mouseDestroy()
									},
									_mouseStart : function (b) {
										var c = this,
										d = this.options;
										this.opos = [b.pageX, b.pageY],
										this.options.disabled || (this.selectees = a(d.filter, this.element[0]), this._trigger("start", b), a(d.appendTo).append(this.helper), this.helper.css({
												left : b.pageX,
												top : b.pageY,
												width : 0,
												height : 0
											}), d.autoRefresh && this.refresh(), this.selectees.filter(".ui-selected").each(function () {
												var d = a.data(this, "selectable-item");
												d.startselected = !0,
												b.metaKey || b.ctrlKey || (d.$element.removeClass("ui-selected"), d.selected = !1, d.$element.addClass("ui-unselecting"), d.unselecting = !0, c._trigger("unselecting", b, {
														unselecting : d.element
													}))
											}), a(b.target).parents().addBack().each(function () {
												var d,
												e = a.data(this, "selectable-item");
												return e ? (d = !b.metaKey && !b.ctrlKey || !e.$element.hasClass("ui-selected"), e.$element.removeClass(d ? "ui-unselecting" : "ui-selected").addClass(d ? "ui-selecting" : "ui-unselecting"), e.unselecting = !d, e.selecting = d, e.selected = d, d ? c._trigger("selecting", b, {
														selecting : e.element
													}) : c._trigger("unselecting", b, {
														unselecting : e.element
													}), !1) : void 0
											}))
									},
									_mouseDrag : function (b) {
										if (this.dragged = !0, !this.options.disabled) {
											var c,
											d = this,
											e = this.options,
											f = this.opos[0],
											g = this.opos[1],
											h = b.pageX,
											i = b.pageY;
											return f > h && (c = h, h = f, f = c),
											g > i && (c = i, i = g, g = c),
											this.helper.css({
												left : f,
												top : g,
												width : h - f,
												height : i - g
											}),
											this.selectees.each(function () {
												var c = a.data(this, "selectable-item"),
												j = !1;
												c && c.element !== d.element[0] && ("touch" === e.tolerance ? j = !(c.left > h || c.right < f || c.top > i || c.bottom < g) : "fit" === e.tolerance && (j = c.left > f && c.right < h && c.top > g && c.bottom < i), j ? (c.selected && (c.$element.removeClass("ui-selected"), c.selected = !1), c.unselecting && (c.$element.removeClass("ui-unselecting"), c.unselecting = !1), c.selecting || (c.$element.addClass("ui-selecting"), c.selecting = !0, d._trigger("selecting", b, {
																selecting : c.element
															}))) : (c.selecting && ((b.metaKey || b.ctrlKey) && c.startselected ? (c.$element.removeClass("ui-selecting"), c.selecting = !1, c.$element.addClass("ui-selected"), c.selected = !0) : (c.$element.removeClass("ui-selecting"), c.selecting = !1, c.startselected && (c.$element.addClass("ui-unselecting"), c.unselecting = !0), d._trigger("unselecting", b, {
																	unselecting : c.element
																}))), c.selected && (b.metaKey || b.ctrlKey || c.startselected || (c.$element.removeClass("ui-selected"), c.selected = !1, c.$element.addClass("ui-unselecting"), c.unselecting = !0, d._trigger("unselecting", b, {
																	unselecting : c.element
																})))))
											}),
											!1
										}
									},
									_mouseStop : function (b) {
										var c = this;
										return this.dragged = !1,
										a(".ui-unselecting", this.element[0]).each(function () {
											var d = a.data(this, "selectable-item");
											d.$element.removeClass("ui-unselecting"),
											d.unselecting = !1,
											d.startselected = !1,
											c._trigger("unselected", b, {
												unselected : d.element
											})
										}),
										a(".ui-selecting", this.element[0]).each(function () {
											var d = a.data(this, "selectable-item");
											d.$element.removeClass("ui-selecting").addClass("ui-selected"),
											d.selecting = !1,
											d.selected = !0,
											d.startselected = !0,
											c._trigger("selected", b, {
												selected : d.element
											})
										}),
										this._trigger("stop", b),
										this.helper.remove(),
										!1
									}
								})
							}
							(jQuery),
							function (a) {
								function b(a, b, c) {
									return a > b && b + c > a
								}
								function c(a) {
									return /left|right/.test(a.css("float")) || /inline|table-cell/.test(a.css("display"))
								}
								a.widget("ui.sortable", a.ui.mouse, {
									version : "1.10.3",
									widgetEventPrefix : "sort",
									ready : !1,
									options : {
										appendTo : "parent",
										axis : !1,
										connectWith : !1,
										containment : !1,
										cursor : "auto",
										cursorAt : !1,
										dropOnEmpty : !0,
										forcePlaceholderSize : !1,
										forceHelperSize : !1,
										grid : !1,
										handle : !1,
										helper : "original",
										items : "> *",
										opacity : !1,
										placeholder : !1,
										revert : !1,
										scroll : !0,
										scrollSensitivity : 20,
										scrollSpeed : 20,
										scope : "default",
										tolerance : "intersect",
										zIndex : 1e3,
										activate : null,
										beforeStop : null,
										change : null,
										deactivate : null,
										out : null,
										over : null,
										receive : null,
										remove : null,
										sort : null,
										start : null,
										stop : null,
										update : null
									},
									_create : function () {
										var a = this.options;
										this.containerCache = {},
										this.element.addClass("ui-sortable"),
										this.refresh(),
										this.floating = this.items.length ? "x" === a.axis || c(this.items[0].item) : !1,
										this.offset = this.element.offset(),
										this._mouseInit(),
										this.ready = !0
									},
									_destroy : function () {
										this.element.removeClass("ui-sortable ui-sortable-disabled"),
										this._mouseDestroy();
										for (var a = this.items.length - 1; a >= 0; a--)
											this.items[a].item.removeData(this.widgetName + "-item");
										return this
									},
									_setOption : function (b, c) {
										"disabled" === b ? (this.options[b] = c, this.widget().toggleClass("ui-sortable-disabled", !!c)) : a.Widget.prototype._setOption.apply(this, arguments)
									},
									_mouseCapture : function (b, c) {
										var d = null,
										e = !1,
										f = this;
										return this.reverting ? !1 : this.options.disabled || "static" === this.options.type ? !1 : (this._refreshItems(b), a(b.target).parents().each(function () {
												return a.data(this, f.widgetName + "-item") === f ? (d = a(this), !1) : void 0
											}), a.data(b.target, f.widgetName + "-item") === f && (d = a(b.target)), d ? !this.options.handle || c || (a(this.options.handle, d).find("*").addBack().each(function () {
													this === b.target && (e = !0)
												}), e) ? (this.currentItem = d, this._removeCurrentsFromItems(), !0) : !1 : !1)
									},
									_mouseStart : function (b, c, d) {
										var e,
										f,
										g = this.options;
										if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(b), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
												top : this.offset.top - this.margins.top,
												left : this.offset.left - this.margins.left
											}, a.extend(this.offset, {
												click : {
													left : b.pageX - this.offset.left,
													top : b.pageY - this.offset.top
												},
												parent : this._getParentOffset(),
												relative : this._getRelativeOffset()
											}), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(b), this.originalPageX = b.pageX, this.originalPageY = b.pageY, g.cursorAt && this._adjustOffsetFromHelper(g.cursorAt), this.domPosition = {
												prev : this.currentItem.prev()[0],
												parent : this.currentItem.parent()[0]
											}, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), g.containment && this._setContainment(), g.cursor && "auto" !== g.cursor && (f = this.document.find("body"), this.storedCursor = f.css("cursor"), f.css("cursor", g.cursor), this.storedStylesheet = a("<style>*{ cursor: " + g.cursor + " !important; }</style>").appendTo(f)), g.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", g.opacity)), g.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", g.zIndex)), this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", b, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !d)
											for (e = this.containers.length - 1; e >= 0; e--)
												this.containers[e]._trigger("activate", b, this._uiHash(this));
										return a.ui.ddmanager && (a.ui.ddmanager.current = this),
										a.ui.ddmanager && !g.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b),
										this.dragging = !0,
										this.helper.addClass("ui-sortable-helper"),
										this._mouseDrag(b),
										!0
									},
									_mouseDrag : function (b) {
										var c,
										d,
										e,
										f,
										g = this.options,
										h = !1;
										for (this.position = this._generatePosition(b), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - b.pageY < g.scrollSensitivity ? this.scrollParent[0].scrollTop = h = this.scrollParent[0].scrollTop + g.scrollSpeed : b.pageY - this.overflowOffset.top < g.scrollSensitivity && (this.scrollParent[0].scrollTop = h = this.scrollParent[0].scrollTop - g.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - b.pageX < g.scrollSensitivity ? this.scrollParent[0].scrollLeft = h = this.scrollParent[0].scrollLeft + g.scrollSpeed : b.pageX - this.overflowOffset.left < g.scrollSensitivity && (this.scrollParent[0].scrollLeft = h = this.scrollParent[0].scrollLeft - g.scrollSpeed)) : (b.pageY - a(document).scrollTop() < g.scrollSensitivity ? h = a(document).scrollTop(a(document).scrollTop() - g.scrollSpeed) : a(window).height() - (b.pageY - a(document).scrollTop()) < g.scrollSensitivity && (h = a(document).scrollTop(a(document).scrollTop() + g.scrollSpeed)), b.pageX - a(document).scrollLeft() < g.scrollSensitivity ? h = a(document).scrollLeft(a(document).scrollLeft() - g.scrollSpeed) : a(window).width() - (b.pageX - a(document).scrollLeft()) < g.scrollSensitivity && (h = a(document).scrollLeft(a(document).scrollLeft() + g.scrollSpeed))), h !== !1 && a.ui.ddmanager && !g.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b)), this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), c = this.items.length - 1; c >= 0; c--)
											if (d = this.items[c], e = d.item[0], f = this._intersectsWithPointer(d), f && d.instance === this.currentContainer && e !== this.currentItem[0] && this.placeholder[1 === f ? "next" : "prev"]()[0] !== e && !a.contains(this.placeholder[0], e) && ("semi-dynamic" === this.options.type ? !a.contains(this.element[0], e) : !0)) {
												if (this.direction = 1 === f ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(d))
													break;
												this._rearrange(b, d),
												this._trigger("change", b, this._uiHash());
												break
											}
										return this._contactContainers(b),
										a.ui.ddmanager && a.ui.ddmanager.drag(this, b),
										this._trigger("sort", b, this._uiHash()),
										this.lastPositionAbs = this.positionAbs,
										!1
									},
									_mouseStop : function (b, c) {
										if (b) {
											if (a.ui.ddmanager && !this.options.dropBehaviour && a.ui.ddmanager.drop(this, b), this.options.revert) {
												var d = this,
												e = this.placeholder.offset(),
												f = this.options.axis,
												g = {};
												f && "x" !== f || (g.left = e.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft)),
												f && "y" !== f || (g.top = e.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop)),
												this.reverting = !0,
												a(this.helper).animate(g, parseInt(this.options.revert, 10) || 500, function () {
													d._clear(b)
												})
											} else
												this._clear(b, c);
											return !1
										}
									},
									cancel : function () {
										if (this.dragging) {
											this._mouseUp({
												target : null
											}),
											"original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
											for (var b = this.containers.length - 1; b >= 0; b--)
												this.containers[b]._trigger("deactivate", null, this._uiHash(this)), this.containers[b].containerCache.over && (this.containers[b]._trigger("out", null, this._uiHash(this)), this.containers[b].containerCache.over = 0)
										}
										return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), a.extend(this, {
												helper : null,
												dragging : !1,
												reverting : !1,
												_noFinalSort : null
											}), this.domPosition.prev ? a(this.domPosition.prev).after(this.currentItem) : a(this.domPosition.parent).prepend(this.currentItem)),
										this
									},
									serialize : function (b) {
										var c = this._getItemsAsjQuery(b && b.connected),
										d = [];
										return b = b || {},
										a(c).each(function () {
											var c = (a(b.item || this).attr(b.attribute || "id") || "").match(b.expression || /(.+)[\-=_](.+)/);
											c && d.push((b.key || c[1] + "[]") + "=" + (b.key && b.expression ? c[1] : c[2]))
										}),
										!d.length && b.key && d.push(b.key + "="),
										d.join("&")
									},
									toArray : function (b) {
										var c = this._getItemsAsjQuery(b && b.connected),
										d = [];
										return b = b || {},
										c.each(function () {
											d.push(a(b.item || this).attr(b.attribute || "id") || "")
										}),
										d
									},
									_intersectsWith : function (a) {
										var b = this.positionAbs.left,
										c = b + this.helperProportions.width,
										d = this.positionAbs.top,
										e = d + this.helperProportions.height,
										f = a.left,
										g = f + a.width,
										h = a.top,
										i = h + a.height,
										j = this.offset.click.top,
										k = this.offset.click.left,
										l = "x" === this.options.axis || d + j > h && i > d + j,
										m = "y" === this.options.axis || b + k > f && g > b + k,
										n = l && m;
										return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > a[this.floating ? "width" : "height"] ? n : f < b + this.helperProportions.width / 2 && c - this.helperProportions.width / 2 < g && h < d + this.helperProportions.height / 2 && e - this.helperProportions.height / 2 < i
									},
									_intersectsWithPointer : function (a) {
										var c = "x" === this.options.axis || b(this.positionAbs.top + this.offset.click.top, a.top, a.height),
										d = "y" === this.options.axis || b(this.positionAbs.left + this.offset.click.left, a.left, a.width),
										e = c && d,
										f = this._getDragVerticalDirection(),
										g = this._getDragHorizontalDirection();
										return e ? this.floating ? g && "right" === g || "down" === f ? 2 : 1 : f && ("down" === f ? 2 : 1) : !1
									},
									_intersectsWithSides : function (a) {
										var c = b(this.positionAbs.top + this.offset.click.top, a.top + a.height / 2, a.height),
										d = b(this.positionAbs.left + this.offset.click.left, a.left + a.width / 2, a.width),
										e = this._getDragVerticalDirection(),
										f = this._getDragHorizontalDirection();
										return this.floating && f ? "right" === f && d || "left" === f && !d : e && ("down" === e && c || "up" === e && !c)
									},
									_getDragVerticalDirection : function () {
										var a = this.positionAbs.top - this.lastPositionAbs.top;
										return 0 !== a && (a > 0 ? "down" : "up")
									},
									_getDragHorizontalDirection : function () {
										var a = this.positionAbs.left - this.lastPositionAbs.left;
										return 0 !== a && (a > 0 ? "right" : "left")
									},
									refresh : function (a) {
										return this._refreshItems(a),
										this.refreshPositions(),
										this
									},
									_connectWith : function () {
										var a = this.options;
										return a.connectWith.constructor === String ? [a.connectWith] : a.connectWith
									},
									_getItemsAsjQuery : function (b) {
										var c,
										d,
										e,
										f,
										g = [],
										h = [],
										i = this._connectWith();
										if (i && b)
											for (c = i.length - 1; c >= 0; c--)
												for (e = a(i[c]), d = e.length - 1; d >= 0; d--)
													f = a.data(e[d], this.widgetFullName), f && f !== this && !f.options.disabled && h.push([a.isFunction(f.options.items) ? f.options.items.call(f.element) : a(f.options.items, f.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), f]);
										for (h.push([a.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
														options : this.options,
														item : this.currentItem
													}) : a(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]), c = h.length - 1; c >= 0; c--)
											h[c][0].each(function () {
												g.push(this)
											});
										return a(g)
									},
									_removeCurrentsFromItems : function () {
										var b = this.currentItem.find(":data(" + this.widgetName + "-item)");
										this.items = a.grep(this.items, function (a) {
												for (var c = 0; c < b.length; c++)
													if (b[c] === a.item[0])
														return !1;
												return !0
											})
									},
									_refreshItems : function (b) {
										this.items = [],
										this.containers = [this];
										var c,
										d,
										e,
										f,
										g,
										h,
										i,
										j,
										k = this.items,
										l = [[a.isFunction(this.options.items) ? this.options.items.call(this.element[0], b, {
													item : this.currentItem
												}) : a(this.options.items, this.element), this]],
										m = this._connectWith();
										if (m && this.ready)
											for (c = m.length - 1; c >= 0; c--)
												for (e = a(m[c]), d = e.length - 1; d >= 0; d--)
													f = a.data(e[d], this.widgetFullName), f && f !== this && !f.options.disabled && (l.push([a.isFunction(f.options.items) ? f.options.items.call(f.element[0], b, {
																	item : this.currentItem
																}) : a(f.options.items, f.element), f]), this.containers.push(f));
										for (c = l.length - 1; c >= 0; c--)
											for (g = l[c][1], h = l[c][0], d = 0, j = h.length; j > d; d++)
												i = a(h[d]), i.data(this.widgetName + "-item", g), k.push({
													item : i,
													instance : g,
													width : 0,
													height : 0,
													left : 0,
													top : 0
												})
									},
									refreshPositions : function (b) {
										this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
										var c,
										d,
										e,
										f;
										for (c = this.items.length - 1; c >= 0; c--)
											d = this.items[c], d.instance !== this.currentContainer && this.currentContainer && d.item[0] !== this.currentItem[0] || (e = this.options.toleranceElement ? a(this.options.toleranceElement, d.item) : d.item, b || (d.width = e.outerWidth(), d.height = e.outerHeight()), f = e.offset(), d.left = f.left, d.top = f.top);
										if (this.options.custom && this.options.custom.refreshContainers)
											this.options.custom.refreshContainers.call(this);
										else
											for (c = this.containers.length - 1; c >= 0; c--)
												f = this.containers[c].element.offset(), this.containers[c].containerCache.left = f.left, this.containers[c].containerCache.top = f.top, this.containers[c].containerCache.width = this.containers[c].element.outerWidth(), this.containers[c].containerCache.height = this.containers[c].element.outerHeight();
										return this
									},
									_createPlaceholder : function (b) {
										b = b || this;
										var c,
										d = b.options;
										d.placeholder && d.placeholder.constructor !== String || (c = d.placeholder, d.placeholder = {
												element : function () {
													var d = b.currentItem[0].nodeName.toLowerCase(),
													e = a("<" + d + ">", b.document[0]).addClass(c || b.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
													return "tr" === d ? b.currentItem.children().each(function () {
														a("<td>&#160;</td>", b.document[0]).attr("colspan", a(this).attr("colspan") || 1).appendTo(e)
													}) : "img" === d && e.attr("src", b.currentItem.attr("src")),
													c || e.css("visibility", "hidden"),
													e
												},
												update : function (a, e) {
													(!c || d.forcePlaceholderSize) && (e.height() || e.height(b.currentItem.innerHeight() - parseInt(b.currentItem.css("paddingTop") || 0, 10) - parseInt(b.currentItem.css("paddingBottom") || 0, 10)), e.width() || e.width(b.currentItem.innerWidth() - parseInt(b.currentItem.css("paddingLeft") || 0, 10) - parseInt(b.currentItem.css("paddingRight") || 0, 10)))
												}
											}),
										b.placeholder = a(d.placeholder.element.call(b.element, b.currentItem)),
										b.currentItem.after(b.placeholder),
										d.placeholder.update(b, b.placeholder)
									},
									_contactContainers : function (d) {
										var e,
										f,
										g,
										h,
										i,
										j,
										k,
										l,
										m,
										n,
										o = null,
										p = null;
										for (e = this.containers.length - 1; e >= 0; e--)
											if (!a.contains(this.currentItem[0], this.containers[e].element[0]))
												if (this._intersectsWith(this.containers[e].containerCache)) {
													if (o && a.contains(this.containers[e].element[0], o.element[0]))
														continue;
													o = this.containers[e],
													p = e
												} else
													this.containers[e].containerCache.over && (this.containers[e]._trigger("out", d, this._uiHash(this)), this.containers[e].containerCache.over = 0);
										if (o)
											if (1 === this.containers.length)
												this.containers[p].containerCache.over || (this.containers[p]._trigger("over", d, this._uiHash(this)), this.containers[p].containerCache.over = 1);
											else {
												for (g = 1e4, h = null, n = o.floating || c(this.currentItem), i = n ? "left" : "top", j = n ? "width" : "height", k = this.positionAbs[i] + this.offset.click[i], f = this.items.length - 1; f >= 0; f--)
													a.contains(this.containers[p].element[0], this.items[f].item[0]) && this.items[f].item[0] !== this.currentItem[0] && (!n || b(this.positionAbs.top + this.offset.click.top, this.items[f].top, this.items[f].height)) && (l = this.items[f].item.offset()[i], m = !1, Math.abs(l - k) > Math.abs(l + this.items[f][j] - k) && (m = !0, l += this.items[f][j]), Math.abs(l - k) < g && (g = Math.abs(l - k), h = this.items[f], this.direction = m ? "up" : "down"));
												if (!h && !this.options.dropOnEmpty)
													return;
												if (this.currentContainer === this.containers[p])
													return;
												h ? this._rearrange(d, h, null, !0) : this._rearrange(d, null, this.containers[p].element, !0),
												this._trigger("change", d, this._uiHash()),
												this.containers[p]._trigger("change", d, this._uiHash(this)),
												this.currentContainer = this.containers[p],
												this.options.placeholder.update(this.currentContainer, this.placeholder),
												this.containers[p]._trigger("over", d, this._uiHash(this)),
												this.containers[p].containerCache.over = 1
											}
									},
									_createHelper : function (b) {
										var c = this.options,
										d = a.isFunction(c.helper) ? a(c.helper.apply(this.element[0], [b, this.currentItem])) : "clone" === c.helper ? this.currentItem.clone() : this.currentItem;
										return d.parents("body").length || a("parent" !== c.appendTo ? c.appendTo : this.currentItem[0].parentNode)[0].appendChild(d[0]),
										d[0] === this.currentItem[0] && (this._storedCSS = {
												width : this.currentItem[0].style.width,
												height : this.currentItem[0].style.height,
												position : this.currentItem.css("position"),
												top : this.currentItem.css("top"),
												left : this.currentItem.css("left")
											}),
										(!d[0].style.width || c.forceHelperSize) && d.width(this.currentItem.width()),
										(!d[0].style.height || c.forceHelperSize) && d.height(this.currentItem.height()),
										d
									},
									_adjustOffsetFromHelper : function (b) {
										"string" == typeof b && (b = b.split(" ")),
										a.isArray(b) && (b = {
												left : +b[0],
												top : +b[1] || 0
											}),
										"left" in b && (this.offset.click.left = b.left + this.margins.left),
										"right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left),
										"top" in b && (this.offset.click.top = b.top + this.margins.top),
										"bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top)
									},
									_getParentOffset : function () {
										this.offsetParent = this.helper.offsetParent();
										var b = this.offsetParent.offset();
										return "absolute" === this.cssPosition && this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop()),
										(this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && a.ui.ie) && (b = {
												top : 0,
												left : 0
											}), {
											top : b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
											left : b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
										}
									},
									_getRelativeOffset : function () {
										if ("relative" === this.cssPosition) {
											var a = this.currentItem.position();
											return {
												top : a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
												left : a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
											}
										}
										return {
											top : 0,
											left : 0
										}
									},
									_cacheMargins : function () {
										this.margins = {
											left : parseInt(this.currentItem.css("marginLeft"), 10) || 0,
											top : parseInt(this.currentItem.css("marginTop"), 10) || 0
										}
									},
									_cacheHelperProportions : function () {
										this.helperProportions = {
											width : this.helper.outerWidth(),
											height : this.helper.outerHeight()
										}
									},
									_setContainment : function () {
										var b,
										c,
										d,
										e = this.options;
										"parent" === e.containment && (e.containment = this.helper[0].parentNode),
										("document" === e.containment || "window" === e.containment) && (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, a("document" === e.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (a("document" === e.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]),
										/^(document|window|parent)$/.test(e.containment) || (b = a(e.containment)[0], c = a(e.containment).offset(), d = "hidden" !== a(b).css("overflow"), this.containment = [c.left + (parseInt(a(b).css("borderLeftWidth"), 10) || 0) + (parseInt(a(b).css("paddingLeft"), 10) || 0) - this.margins.left, c.top + (parseInt(a(b).css("borderTopWidth"), 10) || 0) + (parseInt(a(b).css("paddingTop"), 10) || 0) - this.margins.top, c.left + (d ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt(a(b).css("borderLeftWidth"), 10) || 0) - (parseInt(a(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, c.top + (d ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt(a(b).css("borderTopWidth"), 10) || 0) - (parseInt(a(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top])
									},
									_convertPositionTo : function (b, c) {
										c || (c = this.position);
										var d = "absolute" === b ? 1 : -1,
										e = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
										f = /(html|body)/i.test(e[0].tagName);
										return {
											top : c.top + this.offset.relative.top * d + this.offset.parent.top * d - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : f ? 0 : e.scrollTop()) * d,
											left : c.left + this.offset.relative.left * d + this.offset.parent.left * d - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : f ? 0 : e.scrollLeft()) * d
										}
									},
									_generatePosition : function (b) {
										var c,
										d,
										e = this.options,
										f = b.pageX,
										g = b.pageY,
										h = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
										i = /(html|body)/i.test(h[0].tagName);
										return "relative" !== this.cssPosition || this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()),
										this.originalPosition && (this.containment && (b.pageX - this.offset.click.left < this.containment[0] && (f = this.containment[0] + this.offset.click.left), b.pageY - this.offset.click.top < this.containment[1] && (g = this.containment[1] + this.offset.click.top), b.pageX - this.offset.click.left > this.containment[2] && (f = this.containment[2] + this.offset.click.left), b.pageY - this.offset.click.top > this.containment[3] && (g = this.containment[3] + this.offset.click.top)), e.grid && (c = this.originalPageY + Math.round((g - this.originalPageY) / e.grid[1]) * e.grid[1], g = this.containment ? c - this.offset.click.top >= this.containment[1] && c - this.offset.click.top <= this.containment[3] ? c : c - this.offset.click.top >= this.containment[1] ? c - e.grid[1] : c + e.grid[1] : c, d = this.originalPageX + Math.round((f - this.originalPageX) / e.grid[0]) * e.grid[0], f = this.containment ? d - this.offset.click.left >= this.containment[0] && d - this.offset.click.left <= this.containment[2] ? d : d - this.offset.click.left >= this.containment[0] ? d - e.grid[0] : d + e.grid[0] : d)), {
											top : g - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : i ? 0 : h.scrollTop()),
											left : f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : i ? 0 : h.scrollLeft())
										}
									},
									_rearrange : function (a, b, c, d) {
										c ? c[0].appendChild(this.placeholder[0]) : b.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? b.item[0] : b.item[0].nextSibling),
										this.counter = this.counter ? ++this.counter : 1;
										var e = this.counter;
										this._delay(function () {
											e === this.counter && this.refreshPositions(!d)
										})
									},
									_clear : function (a, b) {
										this.reverting = !1;
										var c,
										d = [];
										if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
											for (c in this._storedCSS)
												("auto" === this._storedCSS[c] || "static" === this._storedCSS[c]) && (this._storedCSS[c] = "");
											this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
										} else
											this.currentItem.show();
										for (this.fromOutside && !b && d.push(function (a) {
												this._trigger("receive", a, this._uiHash(this.fromOutside))
											}), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || b || d.push(function (a) {
												this._trigger("update", a, this._uiHash())
											}), this !== this.currentContainer && (b || (d.push(function (a) {
														this._trigger("remove", a, this._uiHash())
													}), d.push(function (a) {
														return function (b) {
															a._trigger("receive", b, this._uiHash(this))
														}
													}
														.call(this, this.currentContainer)), d.push(function (a) {
														return function (b) {
															a._trigger("update", b, this._uiHash(this))
														}
													}
														.call(this, this.currentContainer)))), c = this.containers.length - 1; c >= 0; c--)
											b || d.push(function (a) {
												return function (b) {
													a._trigger("deactivate", b, this._uiHash(this))
												}
											}
												.call(this, this.containers[c])), this.containers[c].containerCache.over && (d.push(function (a) {
													return function (b) {
														a._trigger("out", b, this._uiHash(this))
													}
												}
													.call(this, this.containers[c])), this.containers[c].containerCache.over = 0);
										if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, this.cancelHelperRemoval) {
											if (!b) {
												for (this._trigger("beforeStop", a, this._uiHash()), c = 0; c < d.length; c++)
													d[c].call(this, a);
												this._trigger("stop", a, this._uiHash())
											}
											return this.fromOutside = !1,
											!1
										}
										if (b || this._trigger("beforeStop", a, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null, !b) {
											for (c = 0; c < d.length; c++)
												d[c].call(this, a);
											this._trigger("stop", a, this._uiHash())
										}
										return this.fromOutside = !1,
										!0
									},
									_trigger : function () {
										a.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
									},
									_uiHash : function (b) {
										var c = b || this;
										return {
											helper : c.helper,
											placeholder : c.placeholder || a([]),
											position : c.position,
											originalPosition : c.originalPosition,
											offset : c.positionAbs,
											item : c.currentItem,
											sender : b ? b.element : null
										}
									}
								})
							}
							(jQuery),
							define("jqueryui", ["jquery"], function () {}),
							!function (a) {
								a.fn.multiselectable = function (b) {
									function c(c) {
										var d = a(this),
										e = d.parent(),
										f = d.index(),
										g = e.find(".multiselectable-previous");
										g = g.length ? g : a(e.find("." + b.selectedClass)[0]).addClass("multiselectable-previous");
										var h = g.index();
										if ((c.ctrlKey || c.metaKey) && (d.hasClass(b.selectedClass) ? (d.removeClass(b.selectedClass).removeClass("multiselectable-previous"), d.not(".child").length && d.nextUntil(":not(.child)").removeClass(b.selectedClass)) : (e.find(".multiselectable-previous").removeClass("multiselectable-previous"), d.addClass(b.selectedClass).addClass("multiselectable-previous"), d.not(".child").length && d.nextUntil(":not(.child)").addClass(b.selectedClass))), c.shiftKey) {
											var i = e.find(".multiselectable-shift");
											i.removeClass(b.selectedClass).removeClass("multiselectable-shift");
											var j;
											f > h ? j = d.prevUntil(".multiselectable-previous").add(g).add(d) : h > f && (j = d.nextUntil(".multiselectable-previous").add(g).add(d)),
											j.addClass(b.selectedClass).addClass("multiselectable-shift")
										} else
											e.find(".multiselectable-shift").removeClass("multiselectable-shift");
										c.ctrlKey || c.metaKey || c.shiftKey || (e.find(".multiselectable-previous").removeClass("multiselectable-previous"), d.hasClass(b.selectedClass) || (e.find("." + b.selectedClass).removeClass(b.selectedClass), d.addClass(b.selectedClass).addClass("multiselectable-previous"), d.not(".child").length && d.nextUntil(":not(.child)").addClass(b.selectedClass))),
										b.mousedown(c, d)
									}
									function d(c) {
										if (!a(this).is(".ui-draggable-dragging")) {
											var d = a(this),
											e = d.parent();
											c.ctrlKey || c.metaKey || c.shiftKey || (e.find(".multiselectable-previous").removeClass("multiselectable-previous"), e.find("." + b.selectedClass).removeClass(b.selectedClass), d.addClass(b.selectedClass).addClass("multiselectable-previous"), d.not(".child").length && d.nextUntil(":not(.child)").addClass(b.selectedClass)),
											b.click(c, d)
										}
									}
									return b || (b = {}),
									b = a.extend({}, a.fn.multiselectable.defaults, b),
									this.each(function () {
										var e = a(this);
										e.data("multiselectable") || e.data("multiselectable", !0).delegate(b.items, "mousedown", c).delegate(b.items, "click", d).disableSelection()
									})
								},
								a.fn.multiselectable.defaults = {
									click : function () {},
									mousedown : function () {},
									selectedClass : "ui-selected",
									items : "li"
								},
								a.fn.multisortable = function (b) {
									function c(b, c) {
										if (c.find("." + d.selectedClass).length > 0) {
											var e = b.data("i"),
											f = c.find("." + d.selectedClass).filter(function () {
													return a(this).data("i") < e
												}).css({
													position : "",
													width : "",
													left : "",
													top : "",
													zIndex : ""
												});
											b.before(f);
											var g = c.find("." + d.selectedClass).filter(function () {
													return a(this).data("i") > e
												}).css({
													position : "",
													width : "",
													left : "",
													top : "",
													zIndex : ""
												});
											b.after(g),
											setTimeout(function () {
												g.add(f).addClass(d.selectedClass)
											}, 0)
										}
									}
									b || (b = {});
									var d = a.extend({}, a.fn.multisortable.defaults, b);
									return this.each(function () {
										var e = a(this);
										e.multiselectable({
											selectedClass : d.selectedClass,
											click : d.click,
											items : d.items,
											mousedown : d.mousedown
										}),
										b.cancel = d.items + ":not(." + d.selectedClass + ")",
										b.placeholder = d.placeholder,
										b.start = function (b, c) {
											if (c.item.hasClass(d.selectedClass)) {
												var e = c.item.parent();
												e.find("." + d.selectedClass).each(function (b) {
													a(this).data("i", b)
												});
												var f = e.find("." + d.selectedClass).length * c.item.outerHeight();
												c.placeholder.height(f)
											}
											d.start(b, c)
										},
										b.stop = function (a, b) {
											c(b.item, b.item.parent()),
											d.stop(a, b)
										},
										b.sort = function (b, c) {
											var e = c.item.parent(),
											f = c.item.data("i"),
											g = parseInt(c.item.css("top").replace("px", "")),
											h = parseInt(c.item.css("left").replace("px", ""));
											a.fn.reverse = "undefined" == typeof[]._reverse ? Array.prototype.reverse : Array.prototype._reverse;
											var i = 0;
											a("." + d.selectedClass, e).filter(function () {
												return a(this).data("i") < f
											}).reverse().each(function () {
												i += a(this).outerHeight(),
												a(this).css({
													left : h,
													top : g - i,
													position : "absolute",
													zIndex : 1e3,
													width : c.item.width()
												})
											}),
											i = c.item.outerHeight(),
											a("." + d.selectedClass, e).filter(function () {
												return a(this).data("i") > f
											}).each(function () {
												var b = a(this);
												b.css({
													left : h,
													top : g + i,
													position : "absolute",
													zIndex : 1e3,
													width : c.item.width()
												}),
												i += b.outerHeight()
											}),
											d.sort(b, c)
										},
										b.receive = function (a, b) {
											c(b.item, b.sender),
											d.receive(a, b)
										},
										e.sortable(b).disableSelection()
									})
								},
								a.fn.multisortable.defaults = {
									start : function () {},
									stop : function () {},
									sort : function () {},
									receive : function () {},
									click : function () {},
									selectedClass : "ui-selected",
									placeholder : "placeholder",
									items : "li"
								}
							}
							(jQuery),
							define("jquery.multisortable", ["jquery", "jqueryui"], function () {}),
							define("strut/slide_snapshot/SlideDrawer", ["strut/deck/Utils"], function (a) {
								"use strict";
								function b(a, b, c) {
									this.$el = b,
									this.model = a,
									this.$el.css(config.slide.size),
									this._template = JST["strut.slide_snapshot/SlideDrawer"],
									this.setSize(c),
									this.render = this.render.bind(this),
									this.render = _.debounce(this.render, 250),
									this.model.on("contentsChanged", this.render, this)
								}
								return b.prototype = {
									render : function () {
										return this.$el.html(this._template(this.model.attributes)),
										this
									},
									rescale : function () {
										this.$el.css(window.browserPrefix + "transform", "scale(" + this.scale.x + "," + this.scale.y + ")")
									},
									applyBackground : function (b, c, d) {
										a.applyBackground(this.$el, b, c, d)
									},
									dispose : function () {
										this.model.off(null, null, this)
									},
									setSize : function (a) {
										a && (this.size = a, this.scale = {
												x : this.size.width / config.slide.size.width,
												y : this.size.height / config.slide.size.height
											}, this.rescale())
									}
								},
								b
							}),
							define("strut/slide_snapshot/SlideSnapshot", ["libs/backbone", "./SlideDrawer", "css!styles/slide_snapshot/slideSnapshot.css", "strut/deck/Utils", "strut/editor/GlobalEvents"], function (a, b) {
								"use strict";
								return a.View.extend({
									className : "slideSnapshot",
									events : {
										select : "_selected",
										"click .removeBtn" : "_removeClicked",
										"mousedown .removeBtn" : "_removePressed",
										destroyed : "dispose"
									},
									initialize : function () {
										this.model.on("change:selected", this._selectedChanged, this),
										this.model.on("change:active", this._activeChanged, this),
										this.model.on("dispose", this.dispose, this),
										this.model.on("change:background", this._bgChanged, this),
										this.model.on("change:surface", this._bgChanged, this),
										this.options.deck.on("change:background", this._bgChanged, this),
										this.options.deck.on("change:surface", this._bgChanged, this),
										this._template = JST["strut.slide_snapshot/SlideSnapshot"]
									},
									_selected : function (a, b) {
										b.selected ? b.active ? this.model.set("active", !0, b) : this.model.set("selected", !0, b) : this.model.set("selected", !1, b)
									},
									_selectedChanged : function (a, b) {
										b ? this.$el.addClass("ui-selected") : this.$el.removeClass("ui-selected")
									},
									_activeChanged : function (a, b) {
										b ? this.$el.addClass("active") : this.$el.removeClass("active")
									},
									_bgChanged : function () {
										this._slideDrawer.applyBackground(this.model, this.options.deck, {
											surfaceForDefault : !0
										})
									},
									render : function () {
										this._slideDrawer && this._slideDrawer.dispose(),
										this.$el.html(this._template(this.model.attributes));
										var a = this.$el.find(".slideDrawer");
										this._slideDrawer = new b(this.model, a, {
												width : 120,
												height : 90
											});
										var c = this;
										return c._slideDrawer.render(),
										this.model.get("selected") && this.$el.addClass("ui-selected"),
										this.model.get("active") && this.$el.addClass("active"),
										this._bgChanged(),
										this
									},
									_removeClicked : function (a) {
										this.remove(!0),
										a.stopPropagation()
									},
									_removePressed : function (a) {
										a.stopPropagation()
									},
									remove : function (b) {
										this._slideDrawer.dispose(),
										this.off(),
										this.$el.data("jsView", null),
										this.model.off(null, null, this),
										this.options.deck.off(null, null, this),
										a.View.prototype.remove.apply(this, arguments),
										b && this.options.deck.remove(this.model)
									},
									dispose : function () {
										this.disposed || (this.disposed = !0, this.remove())
									},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("common/Queue", [], function () {
								function a() {
									this._queue = []
								}
								function b() {
									return new a
								}
								return a.prototype = {
									take : function () {
										return 0 != this._queue.length ? this._queue.shift() : null
									},
									enqueue : function (a) {
										this._queue.push(a)
									}
								}, {
									create : b
								}
							}),
							define("common/Throttler", ["common/Queue"], function (a) {
								function b(b, c) {
									this._handle = null,
									this._delay = b,
									this._queue = a.create(),
									this._context = c
								}
								return b.prototype = {
									submit : function (a, b) {
										this._handle ? b && this._handleFailedSubmit(a, b) : this._internalSubmit(a, b)
									},
									cancel : function () {
										this._queue = a.create(),
										this._runLast = null,
										null != this._handle && (clearTimeout(this._handle), this._handle = null)
									},
									_internalSubmit : function (a, b) {
										var c = this;
										this._handle = setTimeout(function () {
												b && b.arguments ? a.apply(c._context, b.arguments) : a.call(c._context),
												c._internalCB()
											}, this._delay)
									},
									_internalCB : function () {
										var a = this._queue.take();
										if (a)
											this._handle = this._internalSubmit(a);
										else if (this._runLast) {
											var b = this._runLast;
											this._runLast = null,
											this._internalSubmit(b[0], b[1])
										} else
											this._handle = null
									},
									_handleFailedSubmit : function (a, b) {
										switch (b.rejectionPolicy) {
										case "queue":
											this._queue.enqueue(a);
											break;
										case "runLast":
											this._runLast = [a, b];
											break;
										case "drop":
										}
									}
								},
								b
							}),
							define("strut/slide_editor/model/WellContextMenuModel", ["libs/backbone"], function (a) {
								"use strict";
								return a.Model.extend({
									initialize : function () {
										this.subs = [],
										this._registry = this.editorModel.registry,
										this._createButtons(),
										this.subs.push(this._registry.on("registered:strut.WellContextButtonProvider", this._buttonRegistered, this)),
										this._slideIndex = 0
									},
									_createButtons : function () {
										var a = this._registry.get("strut.WellContextButtonProvider"),
										b = [];
										a.forEach(function (a) {
											b = b.concat(a.service().createButtons(this.editorModel, this))
										}, this),
										this.set("contextButtons", b)
									},
									slideIndex : function (a) {
										return null == a ? this._slideIndex : (this._slideIndex = a, void 0)
									},
									dispose : function () {
										console.log("DISPOSING CONTEXT MENU!"),
										this.subs.forEach(function (a) {
											a.dispose()
										})
									},
									_buttonRegistered : function (a) {
										var b = a.service().createButtons(this.editorModel, this),
										c = this.get("contextButtons");
										b.forEach(function (a) {
											c.push(a),
											this.trigger("change:contextButtons.push", c, a)
										}, this)
									},
									constructor : function (b) {
										this.editorModel = b,
										a.Model.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/slide_editor/view/WellContextMenu", ["libs/backbone", "../model/WellContextMenuModel", "css!styles/slide_editor/wellContextMenu.css"], function (a, b) {
								"use strict";
								return a.View.extend({
									className : "wellContextMenu absolute",
									initialize : function () {
										this.model = new b(this._editorModel),
										this._template = JST["strut.slide_editor/WellContextMenu"],
										this._currentPos = -1
									},
									reposition : function (a) {
										a.y != this._currentPos.y && (this.$el.css("top", a.y), this.$el.css("left", a.x), this._currentPos = a)
									},
									slideIndex : function (a) {
										this.model.slideIndex(a)
									},
									dispose : function () {
										this.model.dispose()
									},
									render : function () {
										this.$el.html(""),
										this.model.get("contextButtons").forEach(function (a) {
											this.$el.append(a.render().$el)
										}, this)
									},
									constructor : function (b) {
										this._editorModel = b,
										a.View.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/slide_editor/view/SlideWell", ["libs/backbone", "jquery.multisortable", "strut/slide_snapshot/SlideSnapshot", "common/Throttler", "./WellContextMenu", "strut/editor/GlobalEvents", "css!styles/slide_editor/slideWell.css", "tantaman/web/undo_support/CmdListFactory"], function (a, b, c, d, e, f, g, h) {
								"use strict";
								return h.managedInstance("editor"),
								a.View.extend({
									events : {
										mousemove : "_showContextMenu",
										destroyed : "dispose",
										mousedown : "_focused"
									},
									className : "slideWell",
									initialize : function () {
										this._deck.on("slideAdded", this._slideAdded, this),
										this._deck.on("slideMoved", this._slideMoved, this),
										this._deck.on("slidesReset", this._slidesReset, this),
										this._doShowContextMenu = this._doShowContextMenu.bind(this),
										this._throttler = new d(100),
										this._contextMenu = new e(this._editorModel),
										this._contextMenu.render(),
										this.$slides = $('<div class="' + this.className + 'List">'),
										this.$slides.multisortable({
											items : "div.slideSnapshot",
											placeholder : "slidePlaceholder",
											stop : this._dragStopped.bind(this),
											mousedown : this._mousedown.bind(this),
											click : this._clicked.bind(this),
											axis : "y"
										}),
										f.on("cut", this._cut, this),
										f.on("copy", this._copy, this),
										f.on("paste", this._paste, this),
										f.on("delete", this._delete, this),
										this._clipboard = this._editorModel.clipboard
									},
									_focused : function () {
										this._editorModel.set("scope", "slideWell")
									},
									_cut : function () {
										if ("slideWell" == this._editorModel.get("scope")) {
											var a = this._deck.selected;
											this._clipboard.setItems(a),
											this._deck.remove(a)
										}
									},
									_copy : function () {
										if ("slideWell" == this._editorModel.get("scope")) {
											var a = this._deck.selected;
											this._clipboard.setItems(a)
										}
									},
									_paste : function () {
										var a = this._clipboard.getItems();
										null != a && a.length && void 0 != a[0].type && "slide" == a[0].type && this._deck.add(a)
									},
									_delete : function () {
										if ("slideWell" == this._editorModel.get("scope")) {
											var a = this._deck.selected;
											this._deck.remove(a)
										}
									},
									_clicked : function (a, b) {
										var c = a.ctrlKey || a.metaKey || a.shiftKey;
										b.trigger("select", {
											selected : !0,
											active : !c,
											multiselect : c
										})
									},
									_mousedown : function (a, b) {
										var c = a.ctrlKey || a.metaKey || a.shiftKey;
										this.$slides.find("> .ui-selected").trigger("select", {
											selected : !0,
											multiselect : c
										}),
										this.$slides.find(".active").is(".ui-selected") || c || b.trigger("select", {
											selected : !0,
											active : !c,
											multiselect : c
										})
									},
									_dragStopped : function () {
										var a = this.$slides.children().index(this.$slides.find(".ui-selected")[0]),
										b = this._deck.selected;
										this._initiatedMove = !0,
										this._deck.moveSlides(b, a),
										this._initiatedMove = !1
									},
									_showContextMenu : function (a) {
										this._throttler.submit(this._doShowContextMenu, {
											rejectionPolicy : "runLast",
											arguments : [a]
										})
									},
									_doShowContextMenu : function (a) {
										var b = a.pageY - this.$slides.position().top,
										c = 114 * (0 | (b + 40) / 114) - 5;
										this._contextMenu.reposition({
											x : this.$slides.width() / 2 - this._contextMenu.$el.outerWidth() / 2,
											y : c
										}),
										this._contextMenu.slideIndex(Math.ceil(c / 114))
									},
									_slidesReset : function (a) {
										var b = 0,
										c = {
											at : 0
										};
										a.forEach(function (a) {
											c.at = b,
											this._slideAdded(a, c),
											b += 1
										}, this)
									},
									_slideAdded : function (a, b) {
										var d = b.at,
										e = new c({
												model : a,
												deck : this._deck,
												registry : this._registry
											});
										if (0 == d)
											this.$slides.prepend(e.render().$el);
										else {
											var f = $(".slideSnapshot");
											d >= f.length ? this.$slides.append(e.render().$el) : $(f[d]).before(e.render().$el)
										}
									},
									_slideMoved : function () {
										this._initiatedMove || (this.$slides.empty(), this._slidesReset(this._deck.get("slides").models))
									},
									render : function () {
										this.$slides.html(""),
										this.$el.html(this.$slides),
										this._deck.get("slides").forEach(function (a) {
											var b = new c({
													model : a,
													deck : this._deck,
													registry : this._registry
												});
											this.$slides.append(b.render().$el)
										}, this),
										this.$el.append(this._contextMenu.$el);
										var a = this;
										return setTimeout(function () {
											a._doShowContextMenu({
												pageY : 100
											})
										}, 0),
										this
									},
									dispose : function () {
										this._deck.off(null, null, this),
										this._contextMenu.dispose(),
										f.off(null, null, this)
									},
									constructor : function (b) {
										this._deck = b.deck(),
										this._registry = b.registry,
										this._editorModel = b,
										a.View.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/deck/Component", ["./SpatialObject"], function (a) {
								var b,
								c;
								return c = {
									x : config.slide.size.width / 3,
									y : config.slide.size.height / 3
								},
								b = {
									x : 1,
									y : 1
								},
								a.extend({
									initialize : function () {
										return _.defaults(this.attributes, c),
										void 0 === this.attributes.scale ? (this.attributes.scale = {}, _.defaults(this.attributes.scale, b)) : void 0
									},
									customClasses : function (a) {
										return null == a ? this.get("customClasses") : (this.set("customClasses", a), void 0)
									},
									dispose : function () {
										this.trigger("dispose", this),
										this.off()
									},
									constructor : function () {
										a.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/slide_editor/view/Utils", {
								computeSlideDimensions : function (a) {
									var b = a.width(),
									c = a.height();
									300 > c && (c = 300);
									var d = config.slide.size,
									e = b / d.width,
									f = (c - 20) / d.height,
									g = d.height * e;
									if (g > c)
										var h = f;
									else
										var h = e;
									var i = h * d.width,
									j = b - i;
									return {
										scale : h,
										remainingWidth : j,
										scaledWidth : i
									}
								}
							}),
							define("strut/slide_editor/view/OperatingTable", ["libs/backbone", "css!styles/slide_editor/operatingTable.css", "strut/slide_components/ComponentFactory", "strut/editor/GlobalEvents", "strut/deck/Component", "strut/deck/Utils", "./Utils", "marked"], function (a, b, c, d, e, f, g, h) {
								"use strict";
								return a.View.extend({
									className : "operatingTable strut-surface",
									events : {
										click : "_clicked",
										focused : "_focus",
										dragover : "_dragover",
										drop : "_drop",
										destroyed : "dispose"
									},
									initialize : function () {
										this._resize = this._resize.bind(this),
										$(window).resize(this._resize),
										this._deck.on("change:activeSlide", function (a, b) {
											this.setModel(b)
										}, this),
										this._deck.on("change:background", this._updateBg, this),
										this._deck.on("change:surface", this._updateSurface, this),
										this.setModel(this._deck.get("activeSlide")),
										d.on("cut", this._cut, this),
										d.on("copy", this._copy, this),
										d.on("paste", this._paste, this),
										d.on("delete", this._delete, this),
										this._clipboard = this._editorModel.clipboard
									},
									render : function () {
										this._$slideContainer = $('<div class="slideContainer"></div>'),
										this.$el.html(this._$slideContainer),
										this._$slideContainer.css(config.slide.size),
										f.applyBackground(this._$slideContainer, this.model, this._deck, {
											transparentForSurface : !0,
											surfaceForDefault : !0,
											transparentForDeckSurface : !0
										}),
										this._$markdownContent = $('<div class="markdownArea themedArea"></div>'),
										this._$slideContainer.append(this._$markdownContent),
										this._$slideContainer.selectable({
											filter : ".component",
											selected : function (a, b) {
												$(b.selected).trigger("select", b)
											},
											unselected : function (a, b) {
												$(b.unselected).trigger("unselect", b)
											}
										});
										var a = this;
										return setTimeout(function () {
											a._rendered = !0,
											a._resize(),
											a._renderContents()
										}, 0),
										this.$el.addClass(this._deck.get("surface") || "bg-default"),
										this
									},
									_updateBg : function () {
										this._$slideContainer && (this._$slideContainer.removeClass(), this._$slideContainer.addClass("slideContainer ui-selectable"), f.applyBackground(this._$slideContainer, this.model, this._deck, {
												transparentForSurface : !0,
												surfaceForDefault : !0
											}))
									},
									_updateSurface : function (a, b) {
										b = f.slideSurface(a, this._deck),
										b && (f.isImg(b) ? this.$el.css("background-image", f.getImgUrl(b)) : (this.$el.css("background-image", ""), this.$el.removeClass(), this.$el.addClass("operatingTable strut-surface " + b)))
									},
									_cut : function () {
										if ("operatingTable" == this._editorModel.get("scope")) {
											var a = this.model.selected;
											a.length && (this._clipboard.setItems(a), this.model.remove(a))
										}
									},
									_copy : function () {
										if ("operatingTable" == this._editorModel.get("scope")) {
											var a = this.model.selected;
											a.length && this._clipboard.setItems(a)
										}
									},
									_paste : function () {
										var a = this._clipboard.getItems();
										null != a && a.length && a[0]instanceof e && this.model.add(a)
									},
									_delete : function () {
										if ("operatingTable" == this._editorModel.get("scope")) {
											var a = this.model.selected;
											a.length && this.model.remove(a)
										}
									},
									_clicked : function () {
										this._focus(),
										this.model.get("components").forEach(function (a) {
											a.get("selected") && a.set("selected", !1)
										}),
										this.$el.find(".editable").removeClass("editable").attr("contenteditable", !1).trigger("editComplete"),
										this._focus()
									},
									_focus : function () {
										this._editorModel.set("scope", "operatingTable")
									},
									_dragover : function (a) {
										a.stopPropagation(),
										a.preventDefault(),
										a.originalEvent.dataTransfer.dropEffect = "copy"
									},
									_drop : function (a) {
										a.stopPropagation(),
										a.preventDefault();
										var b = a.originalEvent.dataTransfer.files[0];
										if (b.type.match("image.*")) {
											var d = new FileReader,
											e = this;
											d.onload = function (a) {
												e.model.add(c.instance.createModel({
														type : "Image",
														src : a.target.result
													}))
											},
											d.readAsDataURL(b)
										}
									},
									_componentAdded : function (a, b) {
										var d = c.instance.createView(b);
										this._$slideContainer.append(d.render())
									},
									setModel : function (a) {
										var b = this.model;
										if (this.model !== a)
											return null != this.model && this.model.off(null, null, this), this.model = a, null != this.model && (this.model.on("change:components.add", this._componentAdded, this), this.model.on("change:background", this._updateBg, this), this.model.on("change:markdown", this._renderMarkdown, this), this.model.on("change:surface", this._updateSurface, this), this._updateBg(), this._updateSurface(this.model, this.model.get("surface"))), this._renderContents(b), this
									},
									dispose : function () {
										$(window).off("resize", this._resize),
										this._deck.off(null, null, this),
										this.model && this.model.off(null, null, this),
										d.off(null, null, this)
									},
									_renderContents : function (a) {
										if (null != a && a.trigger("unrender", !0), this._rendered && null != this.model) {
											var b = this.model.get("components");
											b.forEach(function (a) {
												var b = c.instance.createView(a);
												this._$slideContainer.append(b.render())
											}, this),
											this._renderMarkdown()
										}
									},
									_renderMarkdown : function () {
										this.model.get("markdown") ? this._$markdownContent.html(h(this.model.get("markdown"))) : this._$markdownContent.html("")
									},
									_resize : function () {
										var a = g.computeSlideDimensions(this.$el);
										this._$slideContainer.css({
											"margin-left" : a.remainingWidth / 2,
											"margin-right" : a.remainingWidth / 2
										}),
										this._$slideContainer.css(window.browserPrefix + "transform", "scale(" + a.scale + ")")
									},
									constructor : function (b, c) {
										this._deck = b.deck(),
										this._registry = b.registry,
										this._editorModel = b,
										this._slideEditorModel = c,
										a.View.prototype.constructor.call(this)
									}
								})
							}),
							CodeMirror.defineMode("xml", function (a, b) {
								function c(a, b) {
									function c(c) {
										return b.tokenize = c,
										c(a, b)
									}
									var e = a.next();
									if ("<" == e) {
										if (a.eat("!"))
											return a.eat("[") ? a.match("CDATA[") ? c(f("atom", "]]>")) : null : a.match("--") ? c(f("comment", "-->")) : a.match("DOCTYPE", !0, !0) ? (a.eatWhile(/[\w\._\-]/), c(g(1))) : null;
										if (a.eat("?"))
											return a.eatWhile(/[\w\._\-]/), b.tokenize = f("meta", "?>"), "meta";
										var h = a.eat("/");
										t = "";
										for (var i; i = a.eat(/[^\s\u00a0=<>\"\'\/?]/); )
											t += i;
										return t ? (u = h ? "closeTag" : "openTag", b.tokenize = d, "tag") : "tag error"
									}
									if ("&" == e) {
										var j;
										return j = a.eat("#") ? a.eat("x") ? a.eatWhile(/[a-fA-F\d]/) && a.eat(";") : a.eatWhile(/[\d]/) && a.eat(";") : a.eatWhile(/[\w\.\-:]/) && a.eat(";"),
										j ? "atom" : "error"
									}
									return a.eatWhile(/[^&<]/),
									null
								}
								function d(a, b) {
									var d = a.next();
									if (">" == d || "/" == d && a.eat(">"))
										return b.tokenize = c, u = ">" == d ? "endTag" : "selfcloseTag", "tag";
									if ("=" == d)
										return u = "equals", null;
									if ("<" == d) {
										b.tokenize = c;
										var f = b.tokenize(a, b);
										return f ? f + " error" : "error"
									}
									return /[\'\"]/.test(d) ? (b.tokenize = e(d), b.stringStartCol = a.column(), b.tokenize(a, b)) : (a.eatWhile(/[^\s\u00a0=<>\"\']/), "word")
								}
								function e(a) {
									var b = function (b, c) {
										for (; !b.eol(); )
											if (b.next() == a) {
												c.tokenize = d;
												break
											}
										return "string"
									};
									return b.isInAttribute = !0,
									b
								}
								function f(a, b) {
									return function (d, e) {
										for (; !d.eol(); ) {
											if (d.match(b)) {
												e.tokenize = c;
												break
											}
											d.next()
										}
										return a
									}
								}
								function g(a) {
									return function (b, d) {
										for (var e; null != (e = b.next()); ) {
											if ("<" == e)
												return d.tokenize = g(a + 1), d.tokenize(b, d);
											if (">" == e) {
												if (1 == a) {
													d.tokenize = c;
													break
												}
												return d.tokenize = g(a - 1),
												d.tokenize(b, d)
											}
										}
										return "meta"
									}
								}
								function h() {
									for (var a = arguments.length - 1; a >= 0; a--)
										v.cc.push(arguments[a])
								}
								function i() {
									return h.apply(null, arguments),
									!0
								}
								function j(a, b) {
									var c = B.doNotIndent.hasOwnProperty(a) || v.context && v.context.noIndent;
									v.context = {
										prev : v.context,
										tagName : a,
										indent : v.indented,
										startOfLine : b,
										noIndent : c
									}
								}
								function k() {
									v.context && (v.context = v.context.prev)
								}
								function l(a) {
									if ("openTag" == a)
										return v.tagName = t, v.tagStart = w.column(), i(p, m(v.startOfLine));
									if ("closeTag" == a) {
										var b = !1;
										return v.context ? v.context.tagName != t && (B.implicitlyClosed.hasOwnProperty(v.context.tagName.toLowerCase()) && k(), b = !v.context || v.context.tagName != t) : b = !0,
										b && (x = "error"),
										i(n(b))
									}
									return i()
								}
								function m(a) {
									return function (b) {
										var c = v.tagName;
										return v.tagName = v.tagStart = null,
										"selfcloseTag" == b || "endTag" == b && B.autoSelfClosers.hasOwnProperty(c.toLowerCase()) ? (o(c.toLowerCase()), i()) : "endTag" == b ? (o(c.toLowerCase()), j(c, a), i()) : i()
									}
								}
								function n(a) {
									return function (b) {
										return a && (x = "error"),
										"endTag" == b ? (k(), i()) : (x = "error", i(arguments.callee))
									}
								}
								function o(a) {
									for (var b; ; ) {
										if (!v.context)
											return;
										if (b = v.context.tagName.toLowerCase(), !B.contextGrabbers.hasOwnProperty(b) || !B.contextGrabbers[b].hasOwnProperty(a))
											return;
										k()
									}
								}
								function p(a) {
									return "word" == a ? (x = "attribute", i(q, p)) : "endTag" == a || "selfcloseTag" == a ? h() : (x = "error", i(p))
								}
								function q(a) {
									if ("equals" == a)
										return i(r, p);
									if (B.allowMissing) {
										if ("word" == a)
											return x = "attribute", i(q, p)
									} else
										x = "error";
									return "endTag" == a || "selfcloseTag" == a ? h() : i()
								}
								function r(a) {
									return "string" == a ? i(s) : "word" == a && B.allowUnquoted ? (x = "string", i()) : (x = "error", "endTag" == a || "selfCloseTag" == a ? h() : i())
								}
								function s(a) {
									return "string" == a ? i(s) : h()
								}
								var t,
								u,
								v,
								w,
								x,
								y = a.indentUnit,
								z = b.multilineTagIndentFactor || 1,
								A = b.multilineTagIndentPastTag || !0,
								B = b.htmlMode ? {
									autoSelfClosers : {
										area : !0,
										base : !0,
										br : !0,
										col : !0,
										command : !0,
										embed : !0,
										frame : !0,
										hr : !0,
										img : !0,
										input : !0,
										keygen : !0,
										link : !0,
										meta : !0,
										param : !0,
										source : !0,
										track : !0,
										wbr : !0
									},
									implicitlyClosed : {
										dd : !0,
										li : !0,
										optgroup : !0,
										option : !0,
										p : !0,
										rp : !0,
										rt : !0,
										tbody : !0,
										td : !0,
										tfoot : !0,
										th : !0,
										tr : !0
									},
									contextGrabbers : {
										dd : {
											dd : !0,
											dt : !0
										},
										dt : {
											dd : !0,
											dt : !0
										},
										li : {
											li : !0
										},
										option : {
											option : !0,
											optgroup : !0
										},
										optgroup : {
											optgroup : !0
										},
										p : {
											address : !0,
											article : !0,
											aside : !0,
											blockquote : !0,
											dir : !0,
											div : !0,
											dl : !0,
											fieldset : !0,
											footer : !0,
											form : !0,
											h1 : !0,
											h2 : !0,
											h3 : !0,
											h4 : !0,
											h5 : !0,
											h6 : !0,
											header : !0,
											hgroup : !0,
											hr : !0,
											menu : !0,
											nav : !0,
											ol : !0,
											p : !0,
											pre : !0,
											section : !0,
											table : !0,
											ul : !0
										},
										rp : {
											rp : !0,
											rt : !0
										},
										rt : {
											rp : !0,
											rt : !0
										},
										tbody : {
											tbody : !0,
											tfoot : !0
										},
										td : {
											td : !0,
											th : !0
										},
										tfoot : {
											tbody : !0
										},
										th : {
											td : !0,
											th : !0
										},
										thead : {
											tbody : !0,
											tfoot : !0
										},
										tr : {
											tr : !0
										}
									},
									doNotIndent : {
										pre : !0
									},
									allowUnquoted : !0,
									allowMissing : !0
								}
								 : {
									autoSelfClosers : {},
									implicitlyClosed : {},
									contextGrabbers : {},
									doNotIndent : {},
									allowUnquoted : !1,
									allowMissing : !1
								},
								C = b.alignCDATA;
								return {
									startState : function () {
										return {
											tokenize : c,
											cc : [],
											indented : 0,
											startOfLine : !0,
											tagName : null,
											tagStart : null,
											context : null
										}
									},
									token : function (a, b) {
										if (!b.tagName && a.sol() && (b.startOfLine = !0, b.indented = a.indentation()), a.eatSpace())
											return null;
										x = u = t = null;
										var c = b.tokenize(a, b);
										if (b.type = u, (c || u) && "comment" != c)
											for (v = b, w = a; ; ) {
												var d = b.cc.pop() || l;
												if (d(u || c))
													break
											}
										return b.startOfLine = !1,
										x && (c = "error" == x ? c + " error" : x),
										c
									},
									indent : function (a, b, e) {
										var f = a.context;
										if (a.tokenize.isInAttribute)
											return a.stringStartCol + 1;
										if (a.tokenize != d && a.tokenize != c || f && f.noIndent)
											return e ? e.match(/^(\s*)/)[0].length : 0;
										if (a.tagName)
											return A ? a.tagStart + a.tagName.length + 2 : a.tagStart + y * z;
										if (C && /<!\[CDATA\[/.test(b))
											return 0;
										for (f && /^<\//.test(b) && (f = f.prev); f && !f.startOfLine; )
											f = f.prev;
										return f ? f.indent + y : 0
									},
									electricChars : "/",
									blockCommentStart : "<!--",
									blockCommentEnd : "-->",
									configuration : b.htmlMode ? "html" : "xml",
									helperType : b.htmlMode ? "html" : "xml"
								}
							}),
							CodeMirror.defineMIME("text/xml", "xml"),
							CodeMirror.defineMIME("application/xml", "xml"),
							CodeMirror.mimeModes.hasOwnProperty("text/html") || CodeMirror.defineMIME("text/html", {
								name : "xml",
								htmlMode : !0
							}),
							define("codemirror/modes/xml", function () {}),
							define("codemirror/ManagedEditors", ["codemirror/codemirror", "codemirror/modes/xml"], function (a) {
								function b(b, c) {
									var d = {},
									e = a(function (a) {
											d.el = a,
											c && c(a)
										}, b);
									return d.mirror = e,
									d
								}
								var c = {};
								return {
									getEditor : function (a, d, e) {
										return c[a] || (c[a] = b(d, e))
									}
								}
							}),
							CodeMirror.defineMode("markdown", function (a, b) {
								function c(a, b, c) {
									return b.f = b.inline = c,
									c(a, b)
								}
								function d(a, b, c) {
									return b.f = b.block = c,
									c(a, b)
								}
								function e(a) {
									return a.linkTitle = !1,
									a.em = !1,
									a.strong = !1,
									a.quote = 0,
									q || a.f != g || (a.f = k, a.block = f),
									a.trailingSpace = 0,
									a.trailingSpaceNewLine = !1,
									a.thisLineHasContent = !1,
									null
								}
								function f(a, e) {
									var f = e.list !== !1;
									if (e.list !== !1 && e.indentationDiff >= 0 ? (e.indentationDiff < 4 && (e.indentation -= e.indentationDiff), e.list = null) : e.list !== !1 && e.indentation > 0 ? (e.list = null, e.listDepth = Math.floor(e.indentation / 4)) : e.list !== !1 && (e.list = !1, e.listDepth = 0), e.indentationDiff >= 4)
										return e.indentation -= 4, a.skipToEnd(), w;
									if (a.eatSpace())
										return null;
									if ("#" === a.peek() || e.prevLineHasContent && a.match(O))
										e.header = !0;
									else if (a.eat(">"))
										for (e.indentation++, e.quote = 1, a.eatSpace(); a.eat(">"); )
											a.eatSpace(), e.quote++;
									else {
										if ("[" === a.peek())
											return c(a, e, m);
										if (a.match(K, !0))
											return C;
										if (e.prevLineHasContent && !f || !a.match(L, !0) && !a.match(M, !0)) {
											if (b.fencedCodeBlocks && a.match(/^```([\w+#]*)/, !0))
												return e.localMode = t(RegExp.$1), e.localMode && (e.localState = e.localMode.startState()), d(a, e, h), w
										} else
											e.indentation += 4, e.list = !0, e.listDepth++, b.taskLists && a.match(N, !1) && (e.taskList = !0)
									}
									return c(a, e, e.inline)
								}
								function g(a, b) {
									var c = r.token(a, b.htmlState);
									return q && "tag" === c && "openTag" !== b.htmlState.type && !b.htmlState.context && (b.f = k, b.block = f),
									b.md_inside && -1 != a.current().indexOf(">") && (b.f = k, b.block = f, b.htmlState.context = void 0),
									c
								}
								function h(a, b) {
									return a.sol() && a.match(/^```/, !0) ? (b.localMode = b.localState = null, b.f = k, b.block = f, w) : b.localMode ? b.localMode.token(a, b.localState) : (a.skipToEnd(), w)
								}
								function i(a) {
									var b = [];
									if (a.taskOpen)
										return "meta";
									if (a.taskClosed)
										return "property";
									if (a.strong && b.push(J), a.em && b.push(I), a.linkText && b.push(G), a.code && b.push(w), a.header && b.push(v), a.quote && b.push(a.quote % 2 ? x : y), a.list !== !1) {
										var c = (a.listDepth - 1) % 3;
										c ? 1 === c ? b.push(A) : b.push(B) : b.push(z)
									}
									return a.trailingSpaceNewLine ? b.push("trailing-space-new-line") : a.trailingSpace && b.push("trailing-space-" + (a.trailingSpace % 2 ? "a" : "b")),
									b.length ? b.join(" ") : null
								}
								function j(a, b) {
									return a.match(P, !0) ? i(b) : void 0
								}
								function k(a, e) {
									var f = e.text(a, e);
									if ("undefined" != typeof f)
										return f;
									if (e.list)
										return e.list = null, i(e);
									if (e.taskList) {
										var h = "x" !== a.match(N, !0)[1];
										return h ? e.taskOpen = !0 : e.taskClosed = !0,
										e.taskList = !1,
										i(e)
									}
									e.taskOpen = !1,
									e.taskClosed = !1;
									var j = a.next();
									if ("\\" === j)
										return a.next(), i(e);
									if (e.linkTitle) {
										e.linkTitle = !1;
										var k = j;
										"(" === j && (k = ")"),
										k = (k + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
										var m = "^\\s*(?:[^" + k + "\\\\]+|\\\\\\\\|\\\\.)" + k;
										if (a.match(new RegExp(m), !0))
											return H
									}
									if ("`" === j) {
										var n = i(e),
										o = a.pos;
										a.eatWhile("`");
										var q = 1 + a.pos - o;
										return e.code ? q === u ? (e.code = !1, n) : i(e) : (u = q, e.code = !0, i(e))
									}
									if (e.code)
										return i(e);
									if ("!" === j && a.match(/\[[^\]]*\] ?(?:\(|\[)/, !1))
										return a.match(/\[[^\]]*\]/), e.inline = e.f = l, D;
									if ("[" === j && a.match(/.*\](\(| ?\[)/, !1))
										return e.linkText = !0, i(e);
									if ("]" === j && e.linkText) {
										var r = i(e);
										return e.linkText = !1,
										e.inline = e.f = l,
										r
									}
									if ("<" === j && a.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, !1))
										return c(a, e, p(E, ">"));
									if ("<" === j && a.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, !1))
										return c(a, e, p(F, ">"));
									if ("<" === j && a.match(/^\w/, !1)) {
										if (-1 != a.string.indexOf(">")) {
											var s = a.string.substring(1, a.string.indexOf(">"));
											/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(s) && (e.md_inside = !0)
										}
										return a.backUp(1),
										d(a, e, g)
									}
									if ("<" === j && a.match(/^\/\w*?>/))
										return e.md_inside = !1, "tag";
									var t = !1;
									if (!b.underscoresBreakWords && "_" === j && "_" !== a.peek() && a.match(/(\w)/, !1)) {
										var v = a.pos - 2;
										if (v >= 0) {
											var w = a.string.charAt(v);
											"_" !== w && w.match(/(\w)/, !1) && (t = !0)
										}
									}
									var n = i(e);
									if ("*" === j || "_" === j && !t) {
										if (e.strong === j && a.eat(j))
											return e.strong = !1, n;
										if (!e.strong && a.eat(j))
											return e.strong = j, i(e);
										if (e.em === j)
											return e.em = !1, n;
										if (!e.em)
											return e.em = j, i(e)
									} else if (" " === j && (a.eat("*") || a.eat("_"))) {
										if (" " === a.peek())
											return i(e);
										a.backUp(1)
									}
									return " " === j && (a.match(/ +$/, !1) ? e.trailingSpace++ : e.trailingSpace && (e.trailingSpaceNewLine = !0)),
									i(e)
								}
								function l(a, b) {
									if (a.eatSpace())
										return null;
									var d = a.next();
									return "(" === d || "[" === d ? c(a, b, p(H, "(" === d ? ")" : "]")) : "error"
								}
								function m(a, b) {
									return a.match(/^[^\]]*\]:/, !0) ? (b.f = n, G) : c(a, b, k)
								}
								function n(a, b) {
									return a.eatSpace() ? null : (a.match(/^[^\s]+/, !0), void 0 === a.peek() ? b.linkTitle = !0 : a.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/, !0), b.f = b.inline = k, H)
								}
								function o(a) {
									return Q[a] || (a = (a + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), Q[a] = new RegExp("^(?:[^\\\\]|\\\\.)*?(" + a + ")")),
									Q[a]
								}
								function p(a, b, c) {
									return c = c || k,
									function (d, e) {
										return d.match(o(b)),
										e.inline = e.f = c,
										a
									}
								}
								var q = CodeMirror.modes.hasOwnProperty("xml"),
								r = CodeMirror.getMode(a, q ? {
										name : "xml",
										htmlMode : !0
									}
										 : "text/plain"),
								s = {
									html : "htmlmixed",
									js : "javascript",
									json : "application/json",
									c : "text/x-csrc",
									"c++" : "text/x-c++src",
									java : "text/x-java",
									csharp : "text/x-csharp",
									"c#" : "text/x-csharp",
									scala : "text/x-scala"
								},
								t = function () {
									var b,
									c,
									d = {},
									e = {},
									f = [];
									for (var g in CodeMirror.modes)
										CodeMirror.modes.propertyIsEnumerable(g) && f.push(g);
									for (b = 0; b < f.length; b++)
										d[f[b]] = f[b];
									var h = [];
									for (var g in CodeMirror.mimeModes)
										CodeMirror.mimeModes.propertyIsEnumerable(g) && h.push({
											mime : g,
											mode : CodeMirror.mimeModes[g]
										});
									for (b = 0; b < h.length; b++)
										c = h[b].mime, e[c] = h[b].mime;
									for (var i in s)
										(s[i]in d || s[i]in e) && (d[i] = s[i]);
									return function (b) {
										return d[b] ? CodeMirror.getMode(a, d[b]) : null
									}
								}
								();
								void 0 === b.underscoresBreakWords && (b.underscoresBreakWords = !0),
								void 0 === b.fencedCodeBlocks && (b.fencedCodeBlocks = !1),
								void 0 === b.taskLists && (b.taskLists = !1);
								var u = 0,
								v = "header",
								w = "comment",
								x = "atom",
								y = "number",
								z = "variable-2",
								A = "variable-3",
								B = "keyword",
								C = "hr",
								D = "tag",
								E = "link",
								F = "link",
								G = "link",
								H = "string",
								I = "em",
								J = "strong",
								K = /^([*\-=_])(?:\s*\1){2,}\s*$/,
								L = /^[*\-+]\s+/,
								M = /^[0-9]+\.\s+/,
								N = /^\[(x| )\](?=\s)/,
								O = /^(?:\={1,}|-{1,})$/,
								P = /^[^!\[\]*_\\<>` "'(]+/,
								Q = [];
								return {
									startState : function () {
										return {
											f : f,
											prevLineHasContent : !1,
											thisLineHasContent : !1,
											block : f,
											htmlState : CodeMirror.startState(r),
											indentation : 0,
											inline : k,
											text : j,
											linkText : !1,
											linkTitle : !1,
											em : !1,
											strong : !1,
											header : !1,
											taskList : !1,
											list : !1,
											listDepth : 0,
											quote : 0,
											trailingSpace : 0,
											trailingSpaceNewLine : !1
										}
									},
									copyState : function (a) {
										return {
											f : a.f,
											prevLineHasContent : a.prevLineHasContent,
											thisLineHasContent : a.thisLineHasContent,
											block : a.block,
											htmlState : CodeMirror.copyState(r, a.htmlState),
											indentation : a.indentation,
											localMode : a.localMode,
											localState : a.localMode ? CodeMirror.copyState(a.localMode, a.localState) : null,
											inline : a.inline,
											text : a.text,
											linkTitle : a.linkTitle,
											em : a.em,
											strong : a.strong,
											header : a.header,
											taskList : a.taskList,
											list : a.list,
											listDepth : a.listDepth,
											quote : a.quote,
											trailingSpace : a.trailingSpace,
											trailingSpaceNewLine : a.trailingSpaceNewLine,
											md_inside : a.md_inside
										}
									},
									token : function (a, b) {
										if (a.sol()) {
											if (a.match(/^\s*$/, !0))
												return b.prevLineHasContent = !1, e(b);
											b.prevLineHasContent = b.thisLineHasContent,
											b.thisLineHasContent = !0,
											b.header = !1,
											b.taskList = !1,
											b.code = !1,
											b.trailingSpace = 0,
											b.trailingSpaceNewLine = !1,
											b.f = b.block;
											var c = a.match(/^\s*/, !0)[0].replace(/\t/g, "    ").length,
											d = 4 * Math.floor((c - b.indentation) / 4);
											d > 4 && (d = 4);
											var f = b.indentation + d;
											if (b.indentationDiff = f - b.indentation, b.indentation = f, c > 0)
												return null
										}
										return b.f(a, b)
									},
									blankLine : e,
									getType : i
								}
							}, "xml"),
							CodeMirror.defineMIME("text/x-markdown", "markdown"),
							define("codemirror/modes/markdown", ["codemirror/codemirror"], function () {}),
							define("strut/slide_editor/view/MarkdownEditor", ["codemirror/ManagedEditors", "codemirror/modes/markdown", "./Utils"], function (a, b, c) {
								function d(a) {
									this._opts = a,
									this.$el = $(g.el),
									this._resize = this._resize.bind(this)
								}
								var e = "# Markdown!\n",
								f = {
									Enter : "newlineAndIndentContinueMarkdownList"
								},
								g = a.getEditor("optableeditor", {
										mode : "markdown",
										lineNumbers : !0,
										theme : "default",
										extraKeys : f
									});
								return d.prototype = {
									show : function (a) {
										g.mirror.setOption("mode", "markdown"),
										g.mirror.setOption("extraKeys", f),
										this._resize(),
										this._bindResize(),
										this._opts.$target.append(this.$el),
										this.setValue(a)
									},
									setValue : function (a) {
										a = a || e,
										g.mirror.setValue(a)
									},
									getValue : function () {
										var a = g.mirror.getValue();
										return a == e ? "" : a
									},
									hide : function () {
										g.mirror.setValue(""),
										this._unbindResize(),
										this.$el.detach()
									},
									_bindResize : function () {
										$(window).on("resize", this._resize)
									},
									_resize : function () {
										var a = c.computeSlideDimensions(this._opts.$target);
										g.mirror.setSize(a.scaledWidth, this._opts.$target.height() - 20),
										this.$el.css({
											"margin-left" : a.remainingWidth / 2,
											"margin-right" : a.remainingWidth / 2
										})
									},
									_unbindResize : function () {
										$(window).off("resize", this._resize)
									}
								},
								d
							}),
							define("strut/slide_editor/view/SlideEditorView", ["libs/backbone", "./SlideWell", "./OperatingTable", "./MarkdownEditor"], function (a, b, c, d) {
								"use stict";
								return a.View.extend({
									className : "slideEditor",
									initialize : function () {
										this._well = new b(this.model._editorModel),
										this._opTable = new c(this.model._editorModel, this.model),
										this._markdownEditor = new d({
												$target : this._opTable.$el
											}),
										this._prevSlide = this.model.activeSlide(),
										this.model.on("change:mode", this._modeChanged, this),
										this.model.deck().on("change:activeSlide", this._activeSlideChanged, this),
										this.model.on("saveEdits", this._saveCurrentEdits, this)
									},
									remove : function () {
										a.View.prototype.remove.call(this),
										this.model.dispose(),
										this._opTable.dispose(),
										this.model.deck().off(null, null, this)
									},
									render : function () {
										return this.$el.html(),
										this.$el.append(this._well.render().$el),
										this.$el.append(this._opTable.render().$el),
										this
									},
									_activeSlideChanged : function (a, b) {
										this._saveCurrentEdits(),
										this._prevSlide = b,
										this._markdownEditor.setValue(b && b.get("markdown"))
									},
									_modeChanged : function (a, b) {
										if ("markdown" == b)
											this._markdownEditor.show(this.model.activeSlide().get("markdown"));
										else {
											if ("preview" != b)
												throw "Illegal mode";
											this.model.activeSlide().set("markdown", this._markdownEditor.getValue()),
											this._markdownEditor.hide()
										}
									},
									_saveCurrentEdits : function () {
										this._prevSlide && this.model.isMarkdownMode() && this._prevSlide.set("markdown", this._markdownEditor.getValue())
									},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("tantaman/web/widgets/ModeButton", [], function () {
								function a(a, b, c) {
									this.$el = $(c()),
									this.modeId = b,
									this.clicked = this.clicked.bind(this),
									this.modeChanged = this.modeChanged.bind(this),
									this.$el.click(this.clicked),
									this.el = this.$el[0],
									this.editorModel = a,
									a.on("change:activeMode", this.modeChanged, this)
								}
								return a.prototype.render = function () {
									return this
								},
								a.prototype.clicked = function () {
									this.editorModel.changeActiveMode(this.modeId)
								},
								a.prototype.generatorChanged = function () {},
								a.prototype.modeChanged = function (a) {
									a.get("modeId") == this.modeId ? this.$el.addClass("dispNone") : this.$el.removeClass("dispNone")
								},
								a
							}),
							define("strut/slide_editor/main", ["./model/SlideEditorModel", "./view/SlideEditorView", "tantaman/web/widgets/ModeButton", "tantaman/web/widgets/Button"], function (a, b, c, d) {
								function e(a) {
									this._slideEditorModel = a.get("activeMode").model,
									this._button = new d({
											icon : "icon-markdown-white",
											cb : this._toggleMarkdown.bind(this),
											name : "MDown"
										}),
									this._button.$el.addClass("iconBtns"),
									this._slideEditorModel.on("change:mode", this._modeChanged, this)
								}
								var f = {
									getMode : function (c, d) {
										var e = new a({
												editorModel : c
											});
										return {
											view : new b({
												model : e,
												registry : d
											}),
											model : e,
											id : "slide-editor",
											close : function () {
												this.view.remove()
											}
										}
									},
									createButton : function (a) {
										return new c(a, "slide-editor", JST["strut.slide_editor/Button"])
									}
								};
								e.prototype = {
									view : function () {
										return this._button
									},
									_toggleMarkdown : function () {
										this._slideEditorModel.toggleMarkdown()
									},
									_modeChanged : function (a, b) {
										"markdown" == b ? this._button.$el.addClass("active") : this._button.$el.removeClass("active")
									},
									dispose : function () {
										this._slideEditorModel.off(null, null, this)
									}
								};
								var g = {
									create : function (a) {
										return new e(a)
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : "strut.EditMode",
											meta : {
												id : "slide-editor"
											}
										}, f),
										a.register({
											interfaces : "strut.ThemeProvider",
											meta : {
												modes : {
													"slide-editor" : !0
												},
												overflow : !0
											}
										}, g)
									}
								}
							}),
							define("tantaman/web/Utils", [], function () {
								return {
									dispose : function (a) {
										null != a.dispose ? a.dispose() : null != a.forEach && a.forEach(function (a) {
											a.dispose()
										})
									}
								}
							}),
							define("strut/transition_editor/model/OverviewModel", ["tantaman/web/Utils", "libs/backbone"], function (a, b) {
								return b.Model.extend({
									initialize : function () {
										this._editorModel.on("change:generator", this._generatorChanged, this),
										this._generatorChanged(this._editorModel, this._editorModel.get("generator"))
									},
									_generatorChanged : function (a, b) {
										var c = this._registry.get({
												interfaces : "strut.TransitionEditor",
												meta : {
													capabilities : b.capabilities
												}
											});
										this.transitionEditors = [],
										c.forEach(function (a) {
											var b = a.service();
											this.transitionEditors.push(new b({
													model : this._editorModel
												}))
										}, this),
										this.trigger("change:transitionEditors", this, this.transitionEditors)
									},
									dispose : function () {
										a.dispose(this.transitionEditors),
										this.off(),
										this._editorModel.off(null, null, this)
									},
									constructor : function (a, c) {
										this._editorModel = a,
										this._registry = c,
										b.Model.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/transition_editor/view/Overview", ["libs/backbone", "tantaman/web/Utils", "css!styles/transition_editor/overview.css"], function (a, b) {
								return a.View.extend({
									initialize : function () {
										this.model.on("change:transitionEditors", this.render, this),
										this._currentEditors = []
									},
									remove : function () {
										this.dispose()
									},
									dispose : function () {
										a.View.prototype.remove.call(this),
										this.model.dispose(),
										b.dispose(this._currentEditors)
									},
									render : function () {
										return this.$el.html(""),
										b.dispose(this._currentEditors),
										this._currentEditors = [],
										this.model.transitionEditors.forEach(function (a) {
											this._currentEditors.push(a),
											a.render(),
											this.$el.append(a.$el)
										}, this),
										this
									},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("tantaman/web/interactions/TouchBridge", [], function () {
								function a(a) {
									var b = a.originalEvent.changedTouches[0];
									for (var c in b)
										a[c] = b[c];
									a.which = 1
								}
								function b(b) {
									return function (c) {
										a(c),
										b(c)
									}
								}
								function c(a, c) {
									c = b(c);
									var d,
									f;
									return function (a) {
										var b = !1;
										if (d) {
											var g = a.originalEvent.changedTouches[0];
											g.identifier == d.identifier && Date.now() - f < e ? (c(a), d = null) : b = !0
										} else
											b = !0;
										b && (d = a.originalEvent.changedTouches[0], f = Date.now())
									}
								}
								var d = "ontouchend" in document,
								e = 250,
								f = {
									dblclick : function (a, b) {
										var e;
										return d ? (e = "touchstart", b = c(a, b)) : e = "dblclick",
										a.on(e, b),
										function () {
											a.off(e, b)
										}
									},
									mousedown : function (a, c) {
										var e;
										return d ? (e = "touchstart", c = b(c)) : e = "mousedown",
										a.on(e, c),
										function () {
											a.off(e, c)
										}
									},
									mouseup : function (a, c) {
										var e;
										return d ? (e = "touchend", c = b(c)) : e = "mouseup",
										a.on(e, c),
										function () {
											a.off(e, c)
										}
									},
									mousemove : function (a, c) {
										var e;
										return d ? (e = "touchmove", c = b(c)) : e = "mousemove",
										a.on(e, c),
										function () {
											a.off(e, c)
										}
									}
								},
								g = {
									mousedown : function (a, b) {
										d ? a.off("touchstart", b) : a.off("mousedown", b)
									},
									mouseup : function (a, b) {
										d ? a.off("touchend", b) : a.off("mouseup", b)
									},
									mousemove : function (a, b) {
										d ? a.off("touchmove", b) : a.off("mousemove", b)
									}
								};
								return {
									on : f,
									off : g
								}
							}),
							define("tantaman/web/widgets/DeltaDragControl", ["tantaman/web/interactions/TouchBridge"], function (a) {
								var b,
								c;
								return c = ["mousedown", "mousemove", "mouseup"],
								b = function () {
									function b(b, c) {
										this.$el = b,
										this.stopProp = c,
										this.dragging = !1,
										this._mousemove = this.mousemove.bind(this),
										this._mouseup = this.mouseup.bind(this),
										this._mouseout = this._mouseup,
										this._toDispose = [],
										this._toDispose.push(a.on.mousemove($(document), this._mousemove)),
										this._toDispose.push(a.on.mouseup($(document), this._mouseup)),
										a.on.mousedown(this.$el, this.mousedown.bind(this)),
										a.on.mouseup(this.$el, this._mouseup)
									}
									return b.prototype.dispose = function () {
										this._toDispose.forEach(function (a) {
											a()
										})
									},
									b.prototype.mousedown = function (a) {
										return a.preventDefault(),
										this.dragging = !0,
										this._startPos = {
											x : a.pageX,
											y : a.pageY
										},
										this.$el.trigger("deltadragStart", {
											x : a.pageX,
											y : a.pageY
										}),
										this.stopProp ? a.stopPropagation() : void 0
									},
									b.prototype.mousemove = function (a) {
										var b,
										c;
										return this.dragging && (b = a.pageX - this._startPos.x, c = a.pageY - this._startPos.y, this.$el.trigger("deltadrag", [{
														dx : b,
														dy : c,
														x : a.pageX,
														y : a.pageY
													}
												]), this.stopProp) ? a.stopPropagation() : void 0
									},
									b.prototype.mouseup = function () {
										return this.dragging && (this.dragging = !1, this.$el.trigger("deltadragStop")),
										!0
									},
									b
								}
								()
							}),
							define("strut/slide_components/view/ComponentView", ["libs/backbone", "tantaman/web/widgets/DeltaDragControl", "common/Math2", "css!styles/slide_components/ComponentView.css", "strut/editor/GlobalEvents", "strut/deck/ComponentCommands", "tantaman/web/undo_support/CmdListFactory", "tantaman/web/interactions/TouchBridge"], function (a, b, c, d, e, f, g, h) {
								var i = g.managedInstance("editor");
								return a.View.extend({
									transforms : ["skewX", "skewY"],
									className : "component",
									events : function () {
										return {
											select : "_selected",
											unselect : "_unselected",
											click : "clicked",
											"click .removeBtn" : "removeClicked",
											"change input[data-option='x']" : "manualMoveX",
											"change input[data-option='y']" : "manualMoveY",
											"deltadragStart span[data-delta='skewX']" : "skewXStart",
											"deltadrag span[data-delta='skewX']" : "skewX",
											"deltadragStop span[data-delta='skewX']" : "skewXStop",
											"deltadragStart span[data-delta='skewY']" : "skewYStart",
											"deltadrag span[data-delta='skewY']" : "skewY",
											"deltadragStop span[data-delta='skewY']" : "skewYStop",
											"deltadragStart span[data-delta='rotate']" : "rotateStart",
											"deltadrag span[data-delta='rotate']" : "rotate",
											"deltadragStop span[data-delta='rotate']" : "rotateStop",
											"deltadragStart span[data-delta='scale']" : "scaleStart",
											"deltadrag span[data-delta='scale']" : "scale",
											"deltadragStop span[data-delta='scale']" : "scaleStop",
											destroyed : "remove",
											"click .align" : "center"
										}
									},
									initialize : function () {
										this._dragging = !1,
										this.allowDragging = !0,
										this.model.on("change:selected", this._selectionChanged, this),
										this.model.on("change:color", this._colorChanged, this),
										this.model.on("unrender", this._unrender, this),
										this._mouseup = this.mouseup.bind(this),
										this._mousemove = this.mousemove.bind(this),
										this.mousedown = this.mousedown.bind(this),
										this._deltaDrags = [],
										this.model.on("rerender", this._setUpdatedTransform, this),
										this.model.on("change:x", this._xChanged, this),
										this.model.on("change:y", this._yChanged, this),
										this.model.on("change:skewX", this._setUpdatedTransform, this),
										this.model.on("change:skewY", this._setUpdatedTransform, this),
										this.model.on("change:rotate", this._setUpdatedTransform, this),
										this.model.on("change:scale", this._setUpdatedTransform, this),
										this.model.on("change:customClasses", this._updateCustomClasses, this),
										this.model.on("dragStart", this.dragStart, this),
										this.model.on("drag", this.drag, this),
										this.model.on("dragStop", this.dragStop, this),
										this.$el.css("z-index", zTracker.next()),
										this._lastDeltas = {
											dx : 0,
											dy : 0
										},
										this._toDispose = [];
										var a = $(document);
										this._toDispose.push(h.on.mouseup(a, this._mouseup)),
										this._toDispose.push(h.on.mousemove(a, this._mousemove)),
										h.on.mousedown(this.$el, this.mousedown)
									},
									_colorChanged : function (a, b) {
										this.$el.css("color", "#" + b)
									},
									clicked : function (a) {
										return this.$el.css("z-index", zTracker.next()),
										this.$el.trigger("focused"),
										a.stopPropagation(),
										!1
									},
									removeClicked : function (a) {
										a.stopPropagation(),
										this.model.slide && this.model.slide.remove([this.model])
									},
									remove : function (b) {
										var c,
										d,
										e;
										a.View.prototype.remove.call(this),
										e = this._deltaDrags;
										for (d in e)
											c = e[d], c.dispose();
										b && this.model.dispose(),
										this.model.off(null, null, this),
										this._toDispose.forEach(function (a) {
											a()
										})
									},
									mousedown : function (a) {
										this.$el.parents(".ui-selectable").selectable("disable"),
										1 === a.which && (a.preventDefault(), this._selectComponent(a), this.$el.css("zIndex", zTracker.next()), this.model.slide ? this.model.slide.selected.forEach(function (b) {
												b.trigger("dragStart", a)
											}) : this.options.deck.selected.forEach(function (b) {
												b.trigger("dragStart", a)
											}))
									},
									_selectComponent : function () {
										(e.pressed.ctrl || e.pressed.meta || e.pressed.shift) && this.model.get("selected") ? this.model.set("selected", !1) : this.model.set("selected", !0)
									},
									_selected : function () {
										this.model.set("selected", !0, {
											multiselect : !0
										})
									},
									_unselected : function () {
										this.model.set("selected", !1)
									},
									_selectionChanged : function (a, b) {
										b ? this.$el.addClass("ui-selected") : this.$el.removeClass("ui-selected")
									},
									mousemove : function (a) {
										this.model.slide ? this.model.slide.selected.forEach(function (b) {
											b.trigger("drag", a)
										}) : this.options.deck.selected.forEach(function (b) {
											b.trigger("drag", a)
										})
									},
									mouseup : function (a) {
										this.$el.parents(".ui-selectable").selectable("enable");
										var b = this;
										this.model.slide ? i.record(function () {
											b.model.slide.selected.forEach(function (b) {
												b.trigger("dragStop", a)
											})
										}, "Move Components") : i.record(function () {
											b.options.deck.selected.forEach(function (b) {
												b.trigger("dragStop", a)
											})
										}, "Move Slide Transition")
									},
									dragStart : function (a) {
										this.dragScale = this.$el.parent().css(window.browserPrefix + "transform"),
										this.dragScale = parseFloat(this.dragScale.substring(7, this.dragScale.indexOf(","))) || 1,
										this._dragging = !0,
										this.$el.addClass("dragged"),
										this._prevPos = {
											x : this.model.get("x"),
											y : this.model.get("y")
										},
										this._prevMousePos = {
											x : a.pageX,
											y : a.pageY
										}
									},
									drag : function (a) {
										var b,
										c,
										d,
										f,
										g,
										h;
										this._dragging && this.allowDragging && (h = e.pressed.shift, b = a.pageX - this._prevMousePos.x, c = a.pageY - this._prevMousePos.y, f = this._prevPos.x + b / this.dragScale, g = this._prevPos.y + c / this.dragScale, h && (d = 20, f = Math.floor(f / d) * d, g = Math.floor(g / d) * d), this.model.setInt("x", f), this.model.setInt("y", g), this.dragStartLoc || (this.dragStartLoc = {
													x : f,
													y : g
												}))
									},
									dragStop : function () {
										this._dragging && (this._dragging = !1, this.$el.removeClass("dragged"), null != this.dragStartLoc && this.dragStartLoc.x !== this.model.get("x") && this.dragStartLoc.y !== this.model.get("y") && i.pushdo(new f.Move(this.dragStartLoc, this.model)), this.dragStartLoc = null)
									},
									_xChanged : function (a, b) {
										this.$el.css("left", b),
										this.$xInput.val(b)
									},
									_yChanged : function (a, b) {
										this.$el.css("top", b),
										this.$yInput.val(b)
									},
									manualMoveX : function (a) {
										return this.model.setInt("x", a.target.value)
									},
									manualMoveY : function (a) {
										return this.model.setInt("y", a.target.value)
									},
									center : function (a) {
										var b = a.target.getAttribute("data-option");
										getAxis = function (a, b) {
											return "x" == a ? b.width() : b.height()
										};
										var c = getAxis(b, this.$el.parent(".slideContainer")),
										d = getAxis(b, this.$el),
										e = {
											x : this.model.get("x"),
											y : this.model.get("y")
										};
										this.model.setInt(b, c / 2 - d / 2);
										var g = new f.Move(e, this.model);
										i.push(g)
									},
									skewXStart : function () {
										return this._initialSkewX = this.model.get("skewX") || 0
									},
									skewX : function (a, b) {
										this.model.setFloat("skewX", this._initialSkewX + Math.atan2(b.dx, 22))
									},
									skewXStop : function () {
										var a = new f.SkewX(this._initialSkewX, this.model);
										i.push(a)
									},
									skewYStart : function () {
										return this._initialSkewY = this.model.get("skewY") || 0
									},
									skewY : function (a, b) {
										this.model.setFloat("skewY", this._initialSkewY + Math.atan2(b.dy, 22))
									},
									skewYStop : function () {
										var a = new f.SkewY(this._initialSkewY, this.model);
										i.push(a)
									},
									rotateStart : function (a, b) {
										this.updateOrigin(),
										this._rotOffset = this._calcRot(b),
										this._initialRotate = this.model.get("rotate") || 0
									},
									updateOrigin : function () {
										var a;
										a = this.$el.offset(),
										this._origin = {
											x : this.$el.width() / 2 + a.left,
											y : this.$el.height() / 2 + a.top
										}
									},
									_calcRot : function (a) {
										return Math.atan2(a.y - this._origin.y, a.x - this._origin.x)
									},
									rotate : function (a, b) {
										var c,
										d;
										d = this._calcRot(b),
										c = this._initialRotate + d - this._rotOffset,
										e.pressed.shift && (c = Math.floor(8 * (c / Math.PI)) / 8 * Math.PI),
										c %= 2 * Math.PI,
										this.model.setFloat("rotate", c)
									},
									rotateStop : function () {
										var a = new f.Rotate(this._initialRotate, this.model);
										i.push(a)
									},
									scaleStart : function () {
										var a,
										b,
										c,
										d;
										this.dragScale = this.$el.parent().css(window.browserPrefix + "transform"),
										this.dragScale = parseFloat(this.dragScale.substring(7, this.dragScale.indexOf(","))) || 1,
										this._initialScale = this.model.get("scale"),
										b = this.$el.offset(),
										c = this.$el.width() * this._initialScale.x,
										a = this.$el.height() * this._initialScale.y,
										d = this.model.get("rotate") || 0,
										null == this.origSize && (this.origSize = {
												width : this.$el.width(),
												height : this.$el.height()
											}),
										this._scaleDim = {
											width : this._initialScale.x * this.origSize.width,
											height : this._initialScale.y * this.origSize.height,
											theta : d
										}
									},
									scale : function (a, b) {
										var c,
										d;
										c = e.pressed.shift;
										var f = 1,
										g = 1,
										h = (f * b.dx + this._scaleDim.width) / this._scaleDim.width,
										i = (g * b.dy + this._scaleDim.height) / this._scaleDim.height;
										d = {
											x : this._initialScale.x * h,
											y : this._initialScale.y * (c ? i : h)
										},
										d.width = d.x * this.origSize.width,
										d.height = d.y * this.origSize.height,
										this.model.set("scale", d)
									},
									scaleStop : function () {
										var a = new f.Scale(this._initialScale, this.model);
										i.push(a)
									},
									render : function () {
										var a,
										c = this;
										return this.$el.html(this.__getTemplate()(this.model.attributes)),
										this.$el.find("span[data-delta]").each(function (a, d) {
											var e;
											return e = new b($(d), !0),
											c._deltaDrags.push(e)
										}),
										this.$content = this.$el.find(".content"),
										this.$content.addClass(this.model.customClasses()),
										this.$contentScale = this.$el.find(".content-scale"),
										this._selectionChanged(this.model, this.model.get("selected")),
										this.$xInput = this.$el.find("[data-option='x']"),
										this.$yInput = this.$el.find("[data-option='y']"),
										this.$el.css({
											top : this.model.get("y"),
											left : this.model.get("x")
										}),
										a = {
											width : this.$el.width(),
											height : this.$el.height()
										},
										a.width > 0 && a.height > 0 && (this.origSize = a),
										this._setUpdatedTransform(),
										this.$el
									},
									_setUpdatedTransform : function () {
										var a,
										b,
										c,
										d,
										e;
										e = this._buildTransformString(),
										c = {
											transform : e
										},
										c[window.browserPrefix + "transform"] = e,
										this.$content.css(c),
										d = this.model.get("scale"),
										null != this.origSize && (b = d.width || this.origSize.width, a = d.height || this.origSize.height, this.$el.css({
												width : b,
												height : a
											})),
										null != d && this.$contentScale.css(window.browserPrefix + "transform", "scale(" + d.x + "," + d.y + ")"),
										this.$el.css(window.browserPrefix + "transform", "rotate(" + this.model.get("rotate") + "rad)")
									},
									_buildTransformString : function () {
										var a = "";
										return this.transforms.forEach(function (b) {
											var c;
											return c = this.model.get(b),
											c ? a += b + "(" + c + "rad) " : void 0
										}, this),
										a
									},
									_updateCustomClasses : function (a, b) {
										this.$content.attr("class", "content " + b)
									},
									__getTemplate : function () {
										return JST["strut.slide_components/Component"]
									},
									_unrender : function () {
										return this.remove(!1)
									},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/slide_components/view/ThreeDRotatableComponentView", ["./ComponentView", "common/Math2"], function (a, b) {
								var c = 2 * Math.PI;
								return a.extend({
									transforms : ["rotateX", "rotateY", "rotateZ", "scale"],
									events : function () {
										var b;
										return b = a.prototype.events(),
										_.extend(b, {
											"mousedown .form-inline" : "stopProp",
											"deltadragStart span[data-delta='rotateX']" : "rotateXStart",
											"deltadrag span[data-delta='rotateX']" : "rotateX",
											"deltadragStart span[data-delta='rotateZ']" : "rotateZStart",
											"deltadrag span[data-delta='rotateY']" : "rotateY",
											"deltadragStart span[data-delta='rotateY']" : "rotateYStart",
											"deltadrag span[data-delta='rotateZ']" : "rotateZ",
											"change input[data-option='z']" : "manualMoveZ",
											"change input[data-option='scale']" : "manualMoveScale",
											"change input[data-option='rotateX']" : "manualRotX",
											"change input[data-option='rotateY']" : "manualRotY",
											"change input[data-option='rotateZ']" : "manualRotZ"
										})
									},
									initialize : function () {
										return a.prototype.initialize.apply(this, arguments),
										this.model.on("change:rotateX", this._rotXChanged, this),
										this.model.on("change:rotateY", this._rotYChanged, this),
										this.model.on("change:rotateZ", this._rotZChanged, this)
									},
									stopProp : function (a) {
										a.stopPropagation()
									},
									dispose : function () {
										this.model.off(null, null, this)
									},
									manualMoveScale : function (a) {
										return this.model.setFloat("impScale", a.target.value)
									},
									manualMoveZ : function (a) {
										return this.model.setInt("z", a.target.value)
									},
									manualRotX : function (a) {
										return this.model.setFloat("rotateX", b.toRads(a.target.value))
									},
									manualRotY : function (a) {
										return this.model.setFloat("rotateY", b.toRads(a.target.value))
									},
									manualRotZ : function (a) {
										return this.model.setFloat("rotateZ", b.toRads(a.target.value))
									},
									rotateXStart : function (a, b) {
										return this.updateOrigin(),
										this._rotXOffset = this._calcRot(b),
										this._initialRotX = this.model.get("rotateX") || 0
									},
									rotateX : function (a, b) {
										var d;
										return d = .02 * b.dy % c,
										this.model.setFloat("rotateX", this._initialRotX + d)
									},
									_rotXChanged : function (a, c) {
										return this.$rotXInput.val(b.round(b.toDeg(c), 2)),
										this._setUpdatedTransform()
									},
									rotateYStart : function (a, b) {
										return this.updateOrigin(),
										this._rotYOffset = this._calcRot(b),
										this._initialRotY = this.model.get("rotateY") || 0
									},
									rotateY : function (a, b) {
										var d;
										return d = .02 * b.dx % c,
										this.model.setFloat("rotateY", this._initialRotY + d)
									},
									_rotYChanged : function (a, c) {
										return this.$rotYInput.val(b.round(b.toDeg(c), 2)),
										this._setUpdatedTransform()
									},
									rotateZStart : function (a, b) {
										return this.updateOrigin(),
										this._rotZOffset = this._calcRot(b),
										this._initialRotZ = this.model.get("rotateZ") || 0
									},
									rotateZ : function (a, b) {
										var c;
										return c = this._calcRot(b),
										this.model.setFloat("rotateZ", this._initialRotZ + c - this._rotZOffset)
									},
									_rotZChanged : function (a, c) {
										return this.$rotZInput.val(b.round(b.toDeg(c), 2)),
										this._setUpdatedTransform()
									},
									render : function () {
										return a.prototype.render.apply(this, arguments),
										this.$rotXInput = this.$el.find("[data-option='rotateX']"),
										this.$rotYInput = this.$el.find("[data-option='rotateY']"),
										this.$rotZInput = this.$el.find("[data-option='rotateZ']"),
										this
									},
									__getTemplate : function () {
										return null
									},
									constructor : function () {
										a.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/slide_snapshot/TransitionSlideSnapshot", ["strut/slide_components/view/ThreeDRotatableComponentView", "./SlideDrawer", "css!styles/transition_editor/TransitionSlideSnapshot.css", "strut/deck/Utils"], function (a, b) {
								var c = window.config.slide.overviewSize;
								return a.extend({
									className : "component transitionSlideSnapshot",
									events : function () {
										var b;
										return b = a.prototype.events(),
										_.extend(b, {
											mousedown : "mousedown"
										})
									},
									initialize : function () {
										a.prototype.initialize.apply(this, arguments),
										this.model.on("change:impScale", this._impScaleChanged, this),
										this.model.on("change:background", this._backgroundChanged, this),
										this.model.on("change:surface", this._backgroundChanged, this),
										this.options.deck.on("change:background", this._backgroundChanged, this),
										this.options.deck.on("change:surface", this._backgroundChanged, this)
									},
									remove : function () {
										this.dispose(),
										a.prototype.remove.call(this, !1),
										this.model.set("selected", !1)
									},
									dispose : function () {
										null != this.slideDrawer && this.slideDrawer.dispose(),
										a.prototype.dispose.call(this),
										this.model.off(null, null, this),
										this.options.deck.off(null, null, this)
									},
									mousedown : function (b) {
										var c = b.ctrlKey || b.metaKey || b.shiftKey;
										c || this.model.get("selected") || this.model.set("active", !0),
										a.prototype.mousedown.apply(this, arguments)
									},
									_impScaleChanged : function () {
										var a = 0 | this.model.get("impScale"),
										b = this.$el.find(".content"),
										d = c.width * a,
										e = c.height * a,
										f = {
											width : d,
											height : e
										};
										b.css(f),
										this.slideDrawer.setSize(f)
									},
									_backgroundChanged : function () {
										this._$content.removeClass(),
										this._$content.addClass("content"),
										this.slideDrawer.applyBackground(this.model, this.options.deck, {
											transparentForDeckSurface : !0,
											surfaceForDefault : !0
										})
									},
									render : function () {
										a.prototype.render.apply(this, arguments),
										null != this.slideDrawer && this.slideDrawer.dispose(),
										this.$el.css({
											left : this.model.get("x"),
											top : this.model.get("y")
										}),
										this._$content = this.$el.find(".content");
										var c = this.$el.find(".slideDrawer");
										return this.slideDrawer = new b(this.model, c),
										this.slideDrawer.applyBackground(this.model, this.options.deck, {
											transparentForDeckSurface : !0,
											surfaceForDefault : !0
										}),
										this._impScaleChanged(),
										this.slideDrawer.render(),
										this
									},
									__getTemplate : function () {
										return JST["strut.slide_snapshot/TransitionSlideSnapshot"]
									},
									constructor : function () {
										a.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/transition_editor/view/FreeFormTransitionEditorView", ["libs/backbone", "strut/slide_snapshot/TransitionSlideSnapshot", "strut/deck/Utils"], function (a, b, c) {
								"use strict";
								return a.View.extend({
									className : "slideTable strut-surface",
									events : {
										click : "_clicked"
									},
									initialize : function () {
										this._snapshots = [],
										this.model.deck().on("change:surface", this._surfaceChanged, this)
									},
									_surfaceChanged : function (a, b) {
										c.isImg(b) ? this.$el.css("background-image", c.getImgUrl(b)) : (this.$el.css("background-image", ""), this.$el.removeClass(), this.$el.addClass("slideTable strut-surface ui-selectable " + b))
									},
									_clicked : function () {
										this.model.deck().unselectSlides(null, !0)
									},
									remove : function () {
										this.dispose()
									},
									dispose : function () {
										a.View.prototype.remove.call(this),
										this.model.deck().off(null, null, this)
									},
									render : function () {
										this.$el.selectable({
											filter : ".component",
											selected : function (a, b) {
												$(b.selected).trigger("select", b)
											},
											unselected : function (a, b) {
												$(b.unselected).trigger("unselect", b)
											}
										}),
										this.$el.html("");
										var a = this.model.deck();
										this._surfaceChanged(a, a.get("surface"));
										var c = 6,
										d = 0;
										return a.get("slides").forEach(function (e) {
											var f = e.get("x");
											null == f && (e.set("x", 280 * d + 180), e.set("y", 280 * (0 | d / c) + 180)),
											++d;
											var g = new b({
													model : e,
													registry : this.model.registry,
													deck : a
												});
											this._snapshots.push(g),
											this.$el.append(g.render().$el)
										}, this),
										this
									},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/transition_editor/view/CannedTransitionsView", ["libs/backbone"], function (a) {
								function b() {
									return "styles/img/" + this.name + ".png"
								}
								var c = [{
										name : "carousel",
										img : b,
										style : "height: 126px;"
									}, {
										name : "classic",
										img : b
									}, {
										name : "concave",
										img : b,
										style : "height: 126px;"
									}, {
										name : "coverflow",
										img : b
									}, {
										name : "cube",
										img : b
									}, {
										name : "cubeb",
										img : b
									}, {
										name : "cards",
										img : b
									}, {
										name : "none",
										img : "styles/strut.themes/img/nobg.png"
									}
								];
								return a.View.extend({
									events : {
										"click .thumbnail" : "_transitionSelected"
									},
									className : "cannedTransitionsView",
									initialize : function () {
										var a = this.model.cannedTransition() || "none";
										c.some(function (b) {
											b.active = b.name == a ? !0 : !1
										})
									},
									_transitionSelected : function (a) {
										this.$el.find(".active").removeClass("active");
										var b = a.currentTarget.dataset.name;
										this.model.cannedTransition(b),
										$(a.currentTarget).addClass("active")
									},
									render : function () {
										return this.$el.html(JST["strut.transition_editor/CannedTransitions"](c)),
										this
									},
									dispose : function () {},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/transition_editor/main", ["tantaman/web/widgets/ModeButton", "./model/OverviewModel", "./view/Overview", "./view/FreeFormTransitionEditorView", "./view/CannedTransitionsView"], function (a, b, c, d, e) {
								var f = {
									getMode : function (a, d) {
										var e = new b(a, d);
										return {
											view : new c({
												model : e
											}),
											model : e,
											id : "overview",
											close : function () {
												this.view.remove()
											}
										}
									},
									createButton : function (b) {
										return new a(b, "overview", JST["strut.transition_editor/Button"])
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : "strut.EditMode",
											meta : {
												id : "overview"
											}
										}, f),
										a.register({
											interfaces : "strut.TransitionEditor",
											meta : {
												capabilities : {
													freeformStepping : !0
												}
											}
										}, d),
										a.register({
											interfaces : "strut.TransitionEditor",
											meta : {
												capabilities : {
													cannedTransitions : !0
												}
											}
										}, e)
									}
								}
							}),
							define("strut/slide_components/view/ComponentButton", ["libs/backbone"], function (a) {
								"use strict";
								return a.View.extend({
									className : "btn btn-plast",
									tagName : "a",
									events : {
										click : "_clicked"
									},
									initialize : function () {
										this.$el.attr("data-compType", this.options.componentType)
									},
									_clicked : function () {
										this.options.editorModel.addComponent(this.options.componentType)
									},
									render : function () {
										return this.$el.html('<i class="' + this.options.icon + ' icon-white"></i>' + this.options.name),
										this
									},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/slide_components/view/ImportingComponentButton", ["./ComponentButton", "tantaman/web/widgets/ItemImportModal"], function (a, b) {
								"use strict";
								return a.extend({
									initialize : function () {
										a.prototype.initialize.apply(this, arguments),
										this._modal = b.get(this.options),
										this._itemImported = this._itemImported.bind(this)
									},
									_clicked : function () {
										this._modal.show(this._itemImported)
									},
									_itemImported : function (a) {
										this.options.editorModel.addComponent({
											src : a,
											type : this.options.componentType
										})
									},
									constructor : function () {
										a.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/slide_components/model/Image", ["strut/deck/Component", "common/FileUtils"], function (a, b) {
								"use strict";
								return a.extend({
									initialize : function () {
										a.prototype.initialize.apply(this, arguments),
										this.set("type", "Image");
										var c = this.get("src");
										this.set("imageType", b.imageType(c)),
										this.on("change:src", this._updateCache, this),
										this._cachedImage = new Image,
										this._updateCache()
									},
									_updateCache : function () {
										this._cachedImage.src = this.get("src")
									},
									toBase64 : function () {},
									constructor : function (b) {
										a.prototype.constructor.call(this, b)
									}
								})
							}),
							define("strut/slide_components/model/TextBox", ["strut/deck/Component"], function (a) {
								"use strict";
								function b(a) {
									if (a) {
										var b = "<font";
										for (var c in a)
											"size" != c && (b += " ", b += c + '="' + a[c] + '"');
										return b + ">Text</font>"
									}
									return "Text"
								}
								return a.extend({
									initialize : function () {
										if (a.prototype.initialize.apply(this, arguments), this.set("type", "TextBox"), !this.get("text")) {
											var c = b(this._opts && this._opts.fontStyles);
											this._opts && this._opts.fontStyles.size && this.set("size", this._opts.fontStyles.size),
											delete this._opts,
											this.set("text", c),
											this.get("size") || this.set("size", 72)
										}
									},
									constructor : function (b, c) {
										this._opts = c,
										a.prototype.constructor.call(this, b)
									}
								})
							}),
							define("strut/slide_components/model/WebFrame", ["strut/deck/Component", "common/FileUtils"], function (a) {
								"use strict";
								return a.extend({
									initialize : function () {
										a.prototype.initialize.apply(this, arguments),
										this.set("type", "WebFrame")
									},
									constructor : function (b) {
										a.prototype.constructor.call(this, b)
									}
								})
							}),
							define("strut/slide_components/model/Video", ["strut/deck/Component", "common/FileUtils"], function (a, b) {
								"use strict";
								var c = [{
										type : "youtube",
										reg : /youtube\.com\/.*v=(.*?)(&|$)/,
										srcType : function () {
											return "yt"
										}
									}, {
										type : "html5",
										reg : /(.*)/,
										srcType : function (a) {
											return b.type(b.extension(a))
										}
									}
								];
								return a.extend({
									initialize : function () {
										var b,
										d,
										e,
										f;
										for (a.prototype.initialize.apply(this, arguments), this.set("type", "Video"), e = 0, f = c.length; f > e; e++)
											if (b = c[e], d = b.reg.exec(this.get("src")), null != d) {
												this.set("shortSrc", d[1]),
												this.set("videoType", b.type),
												this.set("srcType", b.srcType(d[1]));
												break
											}
										return this
									},
									constructor : function (b) {
										a.prototype.constructor.call(this, b)
									}
								})
							}),
							define("strut/slide_components/view/Mixers", [], function () {
								var a;
								return a = {
									scaleByResize : function (a, b) {
										var c,
										d,
										e;
										return d = this.$el.offset(),
										e = (b.x - d.left) / this.dragScale,
										c = (b.y - d.top) / this.dragScale,
										this.model.set("scale", {
											width : e,
											height : c
										})
									},
									scaleChangeByResize : function (a, b) {
										if (this.origSize) {
											var c = b.width / this.origSize.width;
											b.height = this.origSize.height * c
										}
										this.$el.css(b)
									},
									scaleObjectEmbed : function (a, b) {
										var c,
										d,
										e,
										f;
										return d = this.$el.offset(),
										f = (b.x - d.left) / this.dragScale,
										c = (b.y - d.top) / this.dragScale,
										e = {
											width : f,
											height : c
										},
										this.model.set("scale", e)
									},
									scaleChangeObjectEmbed : function (a, b) {
										this.$object.attr(b),
										this.$embed.attr(b),
										this.$el.css(b)
									}
								}
							}),
							define("strut/slide_components/view/ImageView", ["./ComponentView", "./Mixers"], function (a, b) {
								return a.extend({
									className : "component imageView",
									tagName : "div",
									initialize : function () {
										a.prototype.initialize.apply(this, arguments),
										"SVG" === this.model.get("imageType") && (this.scale = b.scaleByResize, this.model.off("change:scale", this._setUpdatedTransform, this), this.model.on("change:scale", b.scaleChangeByResize, this))
									},
									render : function () {
										var b,
										c = this;
										return a.prototype.render.call(this),
										b = $("<img src=" + this.model.get("src") + "></img>"),
										b.load(function () {
											return c._finishRender($(this))
										}),
										b.error(function () {
											return c.remove()
										}),
										this.$el
									},
									_finishRender : function (a) {
										var b,
										c,
										d,
										e,
										f;
										return d = a[0].naturalWidth,
										c = a[0].naturalHeight,
										"SVG" === this.model.get("imageType") ? (a.css({
												width : "100%",
												height : "100%"
											}), e = this.model.get("scale"), e && e.width ? this.$el.css({
												width : e.width,
												height : e.height
											}) : (f = Math.max(d, 50), b = Math.max(c, 50), this.model.set("scale", {
													width : f,
													height : b
												}))) : (this.origSize = {
												width : d,
												height : c
											}, a[0].width = d, a[0].height = c, this._setUpdatedTransform()),
										a.bind("dragstart", function (a) {
											return a.preventDefault(),
											!1
										}),
										this.$content.append(a),
										"SVG" === this.model.get("imageType") ? (a.parent().addClass("svg"), a.parent().parent().addClass("svg")) : void 0
									}
								})
							}),
							define("strut/slide_components/view/TextBoxView", ["./ComponentView", "libs/etch", "strut/deck/ComponentCommands", "tantaman/web/undo_support/CmdListFactory", "tantaman/web/interactions/TouchBridge"], function (a, b, c, d, e) {
								"use strict";
								var f,
								g = d.managedInstance("editor");
								return f = ["family", "size", "weight", "style", "color", "decoration", "align"],
								a.extend({
									className : "component textBox",
									tagName : "div",
									events : function () {
										var b,
										c;
										return c = a.prototype.events(),
										b = {
											editComplete : "editCompleted",
											mouseup : "mouseup"
										},
										_.extend(c, b)
									},
									initialize : function () {
										var b,
										c,
										d;
										for (a.prototype.initialize.apply(this, arguments), c = 0, d = f.length; d > c; c++)
											b = f[c], this.model.on("change:" + b, this._styleChanged, this);
										this.model.on("change:text", this._textChanged, this),
										this._lastDx = 0,
										this.keydown = this.keydown.bind(this),
										this.dblclicked = this.dblclicked.bind(this),
										e.on.dblclick(this.$el, this.dblclicked),
										this.model.on("edit", this.edit, this)
									},
									scaleStart : function () {
										this._initialSize = this.model.get("size")
									},
									scale : function (a, b) {
										var c,
										d;
										return c = this.model.get("size"),
										d = b.dx - this._lastDx > 0 ? 1 : -1,
										this.model.set("size", c + Math.round(d * Math.sqrt(Math.abs(b.dx - this._lastDx)))),
										this._lastDx = b.dx
									},
									scaleStop : function () {
										var a = c.TextScale(this._initialSize, this.model);
										g.push(a)
									},
									remove : function () {
										a.prototype.remove.apply(this, arguments)
									},
									dblclicked : function (a) {
										if (this.$el.addClass("editable"), this.$el.find(".content").attr("contenteditable", !0), null != a && (this._initialText = this.$textEl.html(), b.editableInit.call(this, a, this.model.get("y") * this.dragScale + 35), !this.editing)) {
											this.$el.find(".content").get(0).focus();
											try {
												document.execCommand("selectAll", !1, null)
											} catch (a) {}

										}
										this.allowDragging = !1,
										this.editing = !0
									},
									mousedown : function (c) {
										return this.editing ? (c.stopPropagation(), b.editableInit.call(this, c, this.model.get("y") * this.dragScale + 35)) : a.prototype.mousedown.apply(this, arguments),
										!0
									},
									mouseup : function () {
										this.editing && b.triggerCaret(),
										a.prototype.mouseup.apply(this, arguments)
									},
									keydown : function (a) {
										this.model.get("selected") && !this.editing && (a.ctrlKey || a.altKey || a.metaKey || !String.fromCharCode(a.which).match(/[\w]/) || this.edit())
									},
									edit : function () {
										var a;
										this.model.set("selected", !0),
										a = $.Event("click", {
												pageX : this.model.get("x")
											}),
										this.dblclicked(a),
										this.$el.find(".content").selectText()
									},
									editCompleted : function () {
										var a;
										if (a = this.$textEl.html(), this.editing = !1, "" === a)
											return this.remove();
										var b = c.Text(this._initialText, this.model);
										g.push(b),
										this.model.set("text", a),
										window.getSelection().removeAllRanges(),
										this.$el.find(".content").attr("contenteditable", !1),
										this.$el.removeClass("editable"),
										this.allowDragging = !0
									},
									_selectionChanged : function (b, c) {
										a.prototype._selectionChanged.apply(this, arguments),
										!c && this.editing && this.editCompleted()
									},
									_styleChanged : function (a, b, c) {
										var d,
										e,
										f;
										if (f = c.changes)
											for (var g = 0; g < f.length; ++g)
												d = f[g], e = a.get(d), e && ("decoration" === d || "align" === d ? d = "text" + d.substring(0, 1).toUpperCase() + d.substr(1) : "color" !== d && (d = "font" + d.substr(0, 1).toUpperCase() + d.substr(1)), this.$el.css(d, b))
									},
									_textChanged : function (a, b) {
										this.$textEl.html(b)
									},
									render : function () {
										return a.prototype.render.call(this),
										this.$textEl = this.$el.find(".content"),
										this.$textEl.html(this.model.get("text")),
										this.$el.css({
											fontSize : this.model.get("size"),
											top : this.model.get("y"),
											left : this.model.get("x")
										}),
										this.$el
									},
									constructor : function () {
										a.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/slide_components/view/WebFrameView", ["./ComponentView"], function (a) {
								return a.extend({
									className : "component webFrameView",
									initialize : function () {
										return a.prototype.initialize.apply(this, arguments)
									},
									render : function () {
										var b,
										c;
										return a.prototype.render.call(this),
										b = $("<iframe width='960' height='768' src=" + this.model.get("src") + "></iframe>"),
										this.$el.find(".content").append(b),
										this.$el.append('<div class="overlay"></div>'),
										c = this.model.get("scale"),
										this.$el.css({
											width : 960 * c.x,
											height : 768 * c.y
										}),
										this.$el
									}
								})
							}),
							define("strut/slide_components/view/VideoView", ["./ComponentView", "./Mixers"], function (a, b) {
								var c,
								d,
								e;
								return c = a.extend({
										className : "component videoView",
										initialize : function () {
											return a.prototype.initialize.apply(this, arguments)
										},
										render : function () {
											var b,
											c = this;
											return a.prototype.render.call(this),
											b = $("<video controls></video>"),
											b.append("<source preload='metadata' src='" + this.model.get("src") + "' type='" + this.model.get("srcType") + "' />"),
											b.bind("loadedmetadata", function () {
												c._finishRender($(this))
											}),
											this.$el.find(".content").append(b),
											this.$el
										},
										_finishRender : function (a) {
											this.origSize = {
												width : a[0].videoWidth,
												height : a[0].videoHeight
											},
											this._setUpdatedTransform()
										}
									}),
								d = a.extend({
										className : "component videoView",
										initialize : function () {
											a.prototype.initialize.apply(this, arguments),
											this.scale = b.scaleObjectEmbed,
											this.model.off("change:scale", this._setUpdatedTransform, this),
											this.model.on("change:scale", b.scaleChangeObjectEmbed, this)
										},
										render : function () {
											var b,
											c;
											return a.prototype.render.call(this),
											b = '<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/' + this.model.get("shortSrc") + '&hl=en&fs=1"><param name="allowFullScreen" value="true"><embed src="http://www.youtube.com/v/' + this.model.get("shortSrc") + '&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="425" height="344"></object>',
											this.$object = $(b),
											this.$embed = this.$object.find("embed"),
											c = this.model.get("scale"),
											c && c.width ? (this.$object.attr(c), this.$embed.attr(c)) : this.model.attributes.scale = {
												width : 425,
												height : 344
											},
											this.$el.find(".content").append(this.$object),
											this.$el
										}
									}),
								e = {
									html5 : c,
									youtube : d
								},
								function (a) {
									return new(e[a.model.get("videoType")])(a)
								}
							}),
							define("tantaman/web/widgets/Utils", [], function () {
								return {
									fitSizeToScale : function (a, b) {
										for (var c = a.length, d = 0; c > d; ++d) {
											var e = $(a[d]),
											f = e.outerWidth(),
											g = e.outerHeight(),
											h = e.parent();
											h.width(f * b),
											h.height(g * b)
										}
									}
								}
							}),
							define("strut/slide_components/view/ShapesDropdown", ["tantaman/web/widgets/Dropdown", "tantaman/web/widgets/Utils"], function (a) {
								function b(b, c, d) {
									a.apply(this, arguments),
									this._editorModel = d.editorModel,
									this.$el.on("click", ".shape", this._selected.bind(this))
								}
								return e(b, a),
								b.prototype._selected = function (a) {
									this._editorModel.addComponent({
										src : a.currentTarget.dataset.src,
										type : "Image"
									})
								},
								b
							}),
							define("strut/slide_components/ShapeCollection", [], function () {
								function a(b, c, d) {
									if (!(this instanceof a))
										return new a(b, c, d);
									this.name = b;
									var e,
									f = window.location.href,
									g = f.indexOf("#");
									-1 != g && (f = f.substring(0, g)),
									e = f.lastIndexOf("/"),
									-1 != e && (f = f.substring(0, e)),
									this.src = f + "/preview_export/shapes/" + c,
									this.aspect = d
								}
								function b() {
									this.title = "shapes",
									this.shapes = [a("square", "square.svg", 1), a("triangle", "triangle.svg", 1), a("circle", "circle.svg", 1), a("hexagon", "hexagon.svg", 1), a("pentagon", "pentagon.svg", 1), a("star", "star.svg", 1), a("pacman", "pacman.svg", 1), a("heart", "heart.svg", 1), a("infinity", "infinity.svg", 1), a("yin yang", "yinyang.svg", 1), a("glasses", "glasses.svg", 1)]
								}
								return b.prototype = {
									on : function () {}

								},
								b
							}),
							define("strut/slide_components/main", ["./view/ComponentButton", "./view/ImportingComponentButton", "./model/Image", "./model/TextBox", "./model/WebFrame", "./model/Video", "./view/ImageView", "./view/TextBoxView", "./view/WebFrameView", "./view/VideoView", "./ComponentFactory", "lang", "./view/ShapesDropdown", "./ShapeCollection"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
								var o = new n,
								p = {
									createButtons : function (c) {
										var d = [];
										return d.push(new a({
												componentType : "TextBox",
												icon : "icon-text-width",
												name : l.text,
												editorModel : c
											})),
										d.push(new b({
												componentType : "Image",
												icon : "icon-picture",
												name : l.image,
												tag : "img",
												title : l.insert_image,
												editorModel : c,
												browsable : !0
											})),
										d.push(new b({
												componentType : "Video",
												icon : "icon-film",
												name : l.video,
												tag : "video",
												title : l.insert_video,
												editorModel : c,
												ignoreErrors : !0
											})),
										d.push(new b({
												componentType : "WebFrame",
												icon : "icon-globe",
												name : l.website,
												tag : "iframe",
												title : l.insert_website,
												editorModel : c
											})),
										d.push(new m(o, JST["strut.slide_components/ShapesDropdown"], {
												"class" : "group-dropdown",
												editorModel : c
											})),
										d
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : "strut.ComponentButtonProvider"
										}, p),
										a.register({
											interfaces : "strut.ComponentModel",
											meta : {
												type : "Image"
											}
										}, c),
										a.register({
											interfaces : "strut.ComponentModel",
											meta : {
												type : "TextBox"
											}
										}, d),
										a.register({
											interfaces : "strut.ComponentModel",
											meta : {
												type : "WebFrame"
											}
										}, e),
										a.register({
											interfaces : "strut.ComponentModel",
											meta : {
												type : "Video"
											}
										}, f),
										a.register({
											interfaces : "strut.ComponentView",
											meta : {
												type : "Image"
											}
										}, g),
										a.register({
											interfaces : "strut.ComponentView",
											meta : {
												type : "TextBox"
											}
										}, h),
										a.register({
											interfaces : "strut.ComponentView",
											meta : {
												type : "WebFrame"
											}
										}, i),
										a.register({
											interfaces : "strut.ComponentView",
											meta : {
												type : "Video"
											}
										}, j),
										k.initialize(a)
									}
								}
							}),
							define("strut/well_context_buttons/AddSlideButton", ["libs/backbone"], function (a) {
								return a.View.extend({
									className : "addBtn btn btn-success",
									events : {
										click : "_addSlide"
									},
									_addSlide : function () {
										this._editorModel.addSlide(this._wellMenuModel.slideIndex())
									},
									render : function () {
										return this.$el.html('<center><i class="icon-plus icon-white"></i></center>'),
										this
									},
									constructor : function (b, c) {
										this._editorModel = b,
										this._wellMenuModel = c,
										a.View.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/well_context_buttons/main", ["./AddSlideButton", "lang"], function (a) {
								"use strict";
								var b = {
									createButtons : function (b, c) {
										var d = [];
										return d.push(new a(b, c)),
										d
									}
								};
								return {
									initialize : function (a) {
										a.register({
											interfaces : ["strut.WellContextButtonProvider"]
										}, b)
									}
								}
							}),
							define("tantaman/web/local_storage/LocalStorageProvider", [], function () {
								function a() {
									this.impl = localStorage,
									this.name = "Local Storage",
									this.id = "localstorage"
								}
								var b = "strut-",
								c = !1;
								return a.prototype = {
									ready : function () {
										return !0
									},
									bg : function () {},
									ls : function (a, c, d) {
										for (var e = this.impl.length, f = [], g = 0; e > g; ++g) {
											var h = this.impl.key(g);
											0 != h.indexOf(b) || null != c && null == c.exec(h) || f.push(h.substring(b.length))
										}
										return d(f),
										this
									},
									rm : function (a, c) {
										return this.impl.removeItem(b + a),
										c && c(!0),
										this
									},
									getContents : function (a, c) {
										var d = this.impl.getItem(b + a);
										if (null != d)
											try {
												var e = JSON.parse(d);
												c(e)
											} catch (f) {
												c(null, f)
											}
										return this
									},
									setContents : function (a, d, e) {
										try {
											this.impl.setItem(b + a, JSON.stringify(d))
										} catch (f) {
											c || (c = !0, alert("Strut currently uses your browser's LocalStorage to save presentations which is limited to between 2.5 and 5mb.\n\nYou are currently over this limit so your presentation will not be saved.  You may continue editing, however.\n\nTry removing any images you dragged in and link to them instead.\n\nWe're working on improving the storage capacity!  5mb should be good if you link to your images (e.g., file://path/to/image or http://url/of/image).\n\nSorry for the inconvenience that this may cause.  We are working to resolve the issue!"))
										}
										return e && e(!0),
										this
									}
								},
								a
							}),
							define("tantaman/web/local_storage/main", ["./LocalStorageProvider"], function (a) {
								var b = new a;
								return {
									initialize : function (a) {
										a.register({
											interfaces : "tantaman.web.StorageProvider"
										}, b)
									}
								}
							}),
							define("strut/logo_button/LogoModel", ["libs/backbone", "framework/ServiceCollection"], function (a, b) {
								return a.Model.extend({
									initialize : function () {
										this.items = new b(this._editorModel.registry, "strut.LogoMenuItemProvider", this._convertServiceEntry.bind(this))
									},
									_convertServiceEntry : function (a) {
										return a.service().createMenuItems(this._editorModel)
									},
									constructor : function (b) {
										this._editorModel = b,
										a.Model.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/logo_button/LogoView", ["libs/backbone", "./LogoModel", "css!styles/logo_button/logo.css"], function (a, b) {
								"use strict";
								return a.View.extend({
									className : "logo-group btn-group",
									initialize : function () {
										this._template = JST["strut.logo_button/Logo"],
										this.model = new b(this.options.editorModel),
										delete this.options.editorModel
									},
									render : function () {
										this.$el.html(this._template());
										var a = this.$el.find(".dropdown-menu");
										return this.model.items.forEach(function (b) {
											a.append(b.render().$el)
										}, this),
										this
									},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/presentation_generator/PreviewLauncher", [], function () {
								"use strict";
								function a(a) {
									this._editorModel = a
								}
								return a.prototype = {
									launch : function (a) {
										window.previewWind && window.previewWind.close(),
										this._editorModel.trigger("launch:preview", null);
										var b = a.generate(this._editorModel.deck());
										localStorage.setItem("preview-string", b),
										localStorage.setItem("preview-config", JSON.stringify({
												surface : this._editorModel.deck().get("surface")
											})),
										window.previewWind = window.open("preview_export/" + a.id + ".html" + a.getSlideHash(this._editorModel), window.location.href)
									}
								},
								a
							}),
							define("strut/presentation_generator/view/PreviewButton", ["libs/backbone", "../PreviewLauncher"], function (a, b) {
								return a.View.extend({
									className : "btn-group iconBtns",
									events : {
										"click .act" : "_launch"
									},
									initialize : function () {
										this._editorModel = this.options.editorModel,
										this._previewLauncher = new b(this._editorModel),
										this._generators = this._editorModel.registry.getBest("strut.presentation_generator.GeneratorCollection"),
										delete this.options.editorModel,
										this._index = Math.min(window.sessionMeta.generator_index || 0, this._generators.length - 1),
										this._generatorChanged(),
										this._template = JST["strut.presentation_generator/Button"]
									},
									_launch : function () {
										this._previewLauncher.launch(this._generators[this._index])
									},
									_bind : function () {
										var a = this;
										this.$el.find("li").each(function (b) {
											var c = $(this);
											c.click(function (d) {
												a.$el.find(".check").css("visibility", "hidden"),
												c.find(".check").css("visibility", ""),
												a._index = b,
												window.sessionMeta.generator_index = b,
												a._generatorChanged(),
												a.$el.find(".dropdown-toggle").dropdown("toggle"),
												d.stopPropagation()
											})
										})
									},
									_generatorChanged : function () {
										this._editorModel.set("generator", this._generators[this._index]),
										this._$readout && this._$readout.text(this._generators[this._index].displayName)
									},
									render : function () {
										return this.$el.html(this._template({
												generators : this._generators,
												chosen : this._generators[this._index]
											})),
										this._bind(),
										this._$readout = this.$el.find(".chosen"),
										$(this.$el.find(".check")[this._index]).css("visibility", ""),
										this
									}
								})
							}),
							define("strut/header/model/ThemeProviderCollection", ["libs/backbone", "framework/ServiceCollection"], function (a, b) {
								function c(a, c) {
									this._editorModel = a,
									this._activeProviders = [],
									this._editorModel.on("change:activeMode", this._modeChanged, this),
									this._themeProviders = new b(a.registry, {
											interfaces : "strut.ThemeProvider",
											meta : c
										}),
									this._modeChanged(null, this._editorModel.get("activeMode")),
									this._themeProviders.on("registered", function (a, b) {
										this._addProvider(b)
									}, this)
								}
								return c.prototype = {
									_modeChanged : function (a, b) {
										this._disposePrevious(),
										this._themeProviders.forEach(function (a) {
											b.id in a.meta().modes && this._addProvider(a)
										}, this),
										this.trigger("change:activeProviders", this._activeProviders)
									},
									_addProvider : function (a) {
										var b = a.service().create(this._editorModel);
										Array.isArray(b) ? this._activeProviders = this._activeProviders.concat(b) : this._activeProviders.push(b)
									},
									_disposePrevious : function () {
										this._activeProviders.forEach(function (a) {
											a.dispose()
										}, this),
										this._activeProviders = []
									},
									activeProviders : function () {
										return this._activeProviders
									}
								},
								_.extend(c.prototype, a.Events),
								c
							}),
							define("strut/header/view/ThemeProviderView", ["libs/backbone", "../model/ThemeProviderCollection"], function (a, b) {
								return a.View.extend({
									className : "themeProviders",
									initialize : function (a) {
										this._providerCollection = new b(a, {
												overflow : !1
											}),
										this._providerCollection.on("change:activeProviders", this.render, this)
									},
									render : function () {
										return this.$el.empty(),
										this._providerCollection.activeProviders().forEach(function (a) {
											this.$el.append(a.view().render().$el)
										}, this),
										this
									},
									constructor : function (b) {
										a.View.prototype.constructor.call(this, b)
									}
								})
							}),
							define("tantaman/web/widgets/Tablets", [], function () {
								function a(a) {
									this._currentItems = [],
									this.$el = $('<div class="tablets hiding">'),
									this.template = a.template;
									var b = this;
									this.$el.on("click", ".tablets-toggle", function () {
										b.toggle()
									})
								}
								return a.prototype = {
									render : function () {
										return this.$el.html(this.template()),
										this.$content = this.$el.find(".tablets-content"),
										this._currentItems.forEach(function (a) {
											this.$content.append(a.render().$el)
										}, this),
										this
									},
									add : function (a) {
										Array.isArray(a) || (a = [a]);
										var b = [];
										a.forEach(function (a) {
											-1 == this._currentItems.indexOf(a) && b.push(a)
										}, this),
										b.forEach(function (a) {
											this._currentItems.push(a),
											this.$content && this.$content.append(a.render().$el)
										}, this)
									},
									empty : function () {
										this.$content && this.$content.html(""),
										this._currentItems = []
									},
									dispose : function () {},
									toggle : function () {
										this.$el.is(".hiding") ? (this.$el.removeClass("hiding"), this.$el.addClass("showing")) : this.hide()
									},
									hide : function () {
										this.$el.removeClass("showing"),
										this.$el.addClass("hiding")
									}
								},
								a
							}),
							define("strut/header/view/Tablets", ["tantaman/web/widgets/Tablets", "../model/ThemeProviderCollection"], function (a, b) {
								function c(c) {
									this._providers = new b(c, {
											overflow : !0
										}),
									this._providers.on("change:activeProviders", this._providersChanged, this),
									this._tablets = new a({
											template : JST["strut.slide_editor/Tablets"]
										}),
									this.$el = this._tablets.$el,
									this._providersChanged()
								}
								return c.prototype = {
									dispose : function () {
										this._tablets.dispose(),
										this._providers.dispose()
									},
									_providersChanged : function () {
										var a = [];
										this._providers.activeProviders().forEach(function (b) {
											a.push(b.view())
										}, this),
										this._tablets.hide(),
										this._tablets.empty(),
										this._tablets.add(a)
									},
									render : function () {
										return this._tablets.render(),
										this
									}
								},
								c
							}),
							define("strut/header/view/HeaderView", ["libs/backbone", "strut/logo_button/LogoView", "strut/presentation_generator/view/PreviewButton", "./ThemeProviderView", "./Tablets", "css!styles/header/header.css"], function (a, b, c, d, e) {
								return a.View.extend({
									className : "row-fluid header",
									initialize : function () {
										this._template = JST["strut.header/Header"],
										this._logoButton = new b({
												editorModel : this.model.editorModel()
											}),
										this._previewButton = new c({
												editorModel : this.model.editorModel()
											}),
										this._themeProviderView = new d(this.model.editorModel()),
										this.model.editorModel().on("change:activeMode", this._modeChanged, this),
										this._tablets = new e(this.model.editorModel())
									},
									_modeChanged : function (a, b) {
										"overview" == b.id ? this.$el.find(".create-comp-buttons").addClass("hidden") : this.$el.find(".create-comp-buttons").removeClass("hidden")
									},
									render : function () {
										this.$el.html(this._template()),
										this.$el.find(".logo-holder").append(this._logoButton.render().$el);
										var a = this.$el.find(".mode-buttons");
										this.model.get("modeButtons").forEach(function (b) {
											a.append(b.render().el)
										}, this);
										var b = this.$el.find(".create-comp-buttons > div");
										this.model.get("createCompButtons").forEach(function (a) {
											b.append(a.render().el)
										}, this),
										a.append(this._previewButton.render().$el);
										var c = this.$el.find(".theme-buttons");
										return c.append(this._themeProviderView.render().$el),
										this._tablets.render(),
										this.$el.append(this._tablets.$el),
										this
									},
									constructor : function () {
										a.View.prototype.constructor.apply(this, arguments)
									}
								})
							}),
							define("strut/editor/CustomBgStylesheet", ["tantaman/web/css_manip/CssManip"], function (a) {
								function b(a) {
									this.model = a,
									a.on("change:customBackgrounds", this.render, this)
								}
								var c = a.getStyleElem({
										id : "customBackgrounds",
										create : !0
									});
								return b.prototype = {
									render : function (a, b) {
										b && (c.innerHTML = JST["strut.presentation_generator/CustomBgStylesheet"](b.get("bgs")))
									},
									dispose : function () {
										this.model.off(null, null, this)
									}
								},
								b
							}),
							define("strut/editor/EditorView", ["libs/backbone", "strut/header/view/HeaderView", "./CustomBgStylesheet"], function (a, b, c) {
								return a.View.extend({
									className : "container-fluid",
									initialize : function () {
										this._header = new b({
												model : this.model.get("header")
											}),
										this.model.on("change:activeMode", this._modeChanged, this),
										this._customBgSheet = new c(this.model)
									},
									render : function () {
										this.$el.empty(),
										this.$el.append(this._header.render().$el);
										var a = this.model.get("activeMode");
										return a ? this.$el.append(a.view.render().$el) : this._renderNoMode(),
										this
									},
									_modeChanged : function (a, b) {
										this.$el.append(b.view.render().$el)
									},
									_renderNoMode : function () {
										this.$el.append('<div class="alert alert-error">No modes available.  Did some plugins fail to load?</div>')
									}
								})
							}),
							define("strut/header/model/HeaderModel", ["libs/backbone"], function (a) {
								return a.Model.extend({
									initialize : function () {
										this._createModeButtons(),
										this._createCreateCompButtons(),
										this.registry.on("registered:strut.ComponentButtonProvider", this._compBtnProviderRegistered, this),
										this.registry.on("registered:strut.EditMode", this._modeRegistered, this)
									},
									editorModel : function () {
										return this._editorModel
									},
									_createModeButtons : function () {
										this._disposeObjects(this.get("modeButtons"));
										var a = this.registry.get("strut.EditMode"),
										b = [];
										a.forEach(function (a) {
											b.push(a.service().createButton(this._editorModel))
										}, this),
										this.set("modeButtons", b)
									},
									_createCreateCompButtons : function () {
										this._disposeObjects(this.get("createCompButtons"));
										var a = this.registry.get("strut.ComponentButtonProvider"),
										b = [];
										a.forEach(function (a) {
											var c = a.service().createButtons(this._editorModel);
											b = b.concat(c)
										}, this),
										this.set("createCompButtons", b)
									},
									_modeRegistered : function (a) {
										var b = a.service().createButton(this._editorModel);
										this.get("modeButtons").push(b),
										this.trigger("change:modeButtons.push", this.get("modeButtons"), b)
									},
									_compBtnProviderRegistered : function (a) {
										var b = a.createButtons();
										this.set("createCompButtons", this.get("createCompButtons").concat(b)),
										this.trigger("change:createCompButtons.concat", this.get("createCompButtons"), b)
									},
									_disposeObjects : function (a) {
										a && a.forEach(function (a) {
											a.dispose()
										})
									},
									constructor : function (b, c) {
										this.registry = b,
										this._editorModel = c,
										a.Model.prototype.constructor.call(this)
									}
								})
							}),
							define("common/Adapter", [], function () {
								function a(a, b) {
									var c = Object.keys(b);
									c.forEach(function (c) {
										var d = b[c];
										this[c] = function () {
											return a[d].apply(a, arguments)
										}
									}, this)
								}
								return a
							}),
							define("tantaman/web/interactions/Clipboard", [], function () {
								function a() {
									this.items = []
								}
								return a.prototype.setItems = function (a) {
									a.length && (this.items = a.slice(0))
								},
								a.prototype.getItems = function () {
									return $.map(this.items, function (a) {
										return a.clone()
									})
								},
								a
							}),
							define("strut/editor/EditorModel", ["libs/backbone", "strut/header/model/HeaderModel", "strut/deck/Deck", "strut/slide_components/ComponentFactory", "common/Adapter", "tantaman/web/interactions/Clipboard", "./GlobalEvents", "tantaman/web/undo_support/CmdListFactory"], function (a, b, c, d, e, f, g, h) {
								"use strict";
								function i(a) {
									return new e(a, {
										store : "savePresentation"
									})
								}
								return a.Model.extend({
									initialize : function () {
										window.uiTestAcc = this,
										this._fontState = window.sessionMeta.fontState || {},
										this._deck = new c,
										this._deck.on("change:customBackgrounds", function (a, b) {
											this.trigger("change:customBackgrounds", this, b)
										}, this),
										this.addSlide(),
										this.set("header", new b(this.registry, this)),
										this.set("modeId", "slide-editor"),
										this.exportable = new e(this, {
												"export" : "exportPresentation",
												identifier : "fileName"
											}),
										this.exportable.adapted = this;
										var d = this.registry.getBest("tantaman.web.saver.AutoSavers");
										if (d) {
											var j = null,
											j = this.registry.getBest("strut.StorageInterface");
											j = i(j),
											this._exitSaver = d.exitSaver(this.exportable, j),
											this._timedSaver = d.timedSaver(this.exportable, 2e4, j)
										}
										this.clipboard = new f,
										this._createMode(),
										this._cmdList = h.managedInstance("editor"),
										g.on("undo", this._cmdList.undo, this._cmdList),
										g.on("redo", this._cmdList.redo, this._cmdList),
										a.on("etch:state", this._fontStateChanged, this)
									},
									changeActiveMode : function (a) {
										a != this.get("modeId") && (this.set("modeId", a), this._createMode())
									},
									customStylesheet : function (a) {
										return null == a ? this._deck.get("customStylesheet") : (this._deck.set("customStylesheet", a), void 0)
									},
									dispose : function () {
										throw "EditorModel can not be disposed yet"
									},
									newPresentation : function () {
										var a = window.sessionMeta.num || 0;
										a += 1,
										window.sessionMeta.num = a,
										this.importPresentation({
											fileName : "presentation-" + a,
											slides : []
										}),
										this._deck.create()
									},
									addCustomBgClassFor : function (a) {
										var b = this._deck.addCustomBgClassFor(a);
										return b.existed || this.trigger("change:customBackgrounds", this, this._deck.get("customBackgrounds")),
										b
									},
									customBackgrounds : function () {
										return this._deck.get("customBackgrounds")
									},
									importPresentation : function (a) {
										console.log("New file name: " + a.fileName),
										this._deck.import(a)
									},
									exportPresentation : function (a) {
										a && this._deck.set("fileName", a);
										var b = this._deck.toJSON(!1, !0);
										return b
									},
									fileName : function () {
										var a = this._deck.get("fileName");
										return null == a && (a = "", this._deck.set("fileName", a)),
										a
									},
									deck : function () {
										return this._deck
									},
									cannedTransition : function (a) {
										return null == a ? this._deck.get("cannedTransition") : (this._deck.set("cannedTransition", a), void 0)
									},
									slides : function () {
										return this._deck.get("slides")
									},
									addSlide : function (a) {
										this._deck.create(a)
									},
									activeSlide : function () {
										return this._deck.get("activeSlide")
									},
									activeSlideIndex : function () {
										return this._deck.get("slides").indexOf(this._deck.get("activeSlide"))
									},
									addComponent : function (a) {
										var b = this._deck.get("activeSlide");
										if (b) {
											var c = d.instance.createModel(a, {
													fontStyles : this._fontState
												});
											b.add(c)
										}
									},
									_fontStateChanged : function (a) {
										_.extend(this._fontState, a),
										window.sessionMeta.fontState = this._fontState
									},
									_createMode : function () {
										var a = this.get("modeId"),
										b = this.registry.getBest({
												interfaces : "strut.EditMode",
												meta : {
													id : a
												}
											});
										if (b) {
											var c = this.get("activeMode");
											c && c.close(),
											this.set("activeMode", b.getMode(this, this.registry))
										}
									},
									constructor : function (b) {
										this.registry = b,
										a.Model.prototype.constructor.call(this)
									}
								})
							}),
							define("strut/startup/main", ["strut/editor/EditorView", "strut/editor/EditorModel"], function (a, b) {
								var c = null,
								d = {
									run : function () {
										var d = new b(c),
										e = new a({
												model : d,
												registry : c
											});
										if (e.render(), $("body").append(e.$el), null != sessionMeta.lastPresentation) {
											var f = c.getBest("strut.StorageInterface");
											f.load(sessionMeta.lastPresentation, function (a, b) {
												b ? (console.log(b), console.log(b.stack)) : d.importPresentation(a)
											})
										}
									}
								},
								e = {
									run : function () {}

								};
								return {
									initialize : function (a) {
										c = a,
										c.register({
											interfaces : "strut.StartupTask"
										}, d),
										c.register({
											interfaces : "strut.StartupTask"
										}, e)
									}
								}
							}),
							define("features", ["framework/ServiceRegistry", "strut/etch_extension/main", "strut/storage/main", "strut/logo_button/main", "strut/themes/main", "strut/editor/main", "strut/exporter/json/main", "strut/exporter/zip/browser/main", "strut/importer/json/main", "strut/importer/main", "strut/exporter/main", "strut/presentation_generator/impress/main", "strut/presentation_generator/bespoke/main", "strut/presentation_generator/handouts/main", "strut/presentation_generator/main", "tantaman/web/saver/main", "strut/slide_editor/main", "strut/transition_editor/main", "strut/slide_components/main", "strut/well_context_buttons/main", "tantaman/web/local_storage/main", "strut/startup/main"], function (a) {
								for (var b = new a, c = Array.prototype.slice.call(arguments, 0), d = 0, d = 1; d < c.length; ++d)
									c[d].initialize(b);
								return b
							}),
							define("common/Concurrent", [], function () {
								function a(a, b, c) {
									this.num = a,
									this.stepCb = c,
									this.completionCb = b,
									this.decrement = this.decrement.bind(this)
								}
								return a.prototype = {
									decrement : function () {
										if (--this.num, this.num < 0)
											throw "Countdown less than zero";
										this.stepCb.apply(null, arguments),
										0 == this.num && this.completionCb.apply(null, arguments)
									}
								}, {
									countdown : a
								}
							}),
							define("StrutLoader", ["common/Concurrent"], function (a) {
								return {
									start : function (b, c, d) {
										var e = b.get("strut.StartupTask"),
										f = new a.countdown(e.length, c, d);
										e.forEach(function (a) {
											var b = a.service();
											b.run(f.decrement)
										})
									}
								}
							}),
							!function (a) {
								"use strict";
								a(function () {
									a.support.transition = function () {
										var a = function () {
											var a,
											b = document.createElement("bootstrap"),
											c = {
												WebkitTransition : "webkitTransitionEnd",
												MozTransition : "transitionend",
												OTransition : "oTransitionEnd otransitionend",
												transition : "transitionend"
											};
											for (a in c)
												if (void 0 !== b.style[a])
													return c[a]
										}
										();
										return a && {
											end : a
										}
									}
									()
								})
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = '[data-dismiss="alert"]',
								c = function (c) {
									a(c).on("click", b, this.close)
								};
								c.prototype.close = function (b) {
									function c() {
										d.trigger("closed").remove()
									}
									var d,
									e = a(this),
									f = e.attr("data-target");
									f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, "")),
									d = a(f),
									b && b.preventDefault(),
									d.length || (d = e.hasClass("alert") ? e : e.parent()),
									d.trigger(b = a.Event("close")),
									b.isDefaultPrevented() || (d.removeClass("in"), a.support.transition && d.hasClass("fade") ? d.on(a.support.transition.end, c) : c())
								};
								var d = a.fn.alert;
								a.fn.alert = function (b) {
									return this.each(function () {
										var d = a(this),
										e = d.data("alert");
										e || d.data("alert", e = new c(this)),
										"string" == typeof b && e[b].call(d)
									})
								},
								a.fn.alert.Constructor = c,
								a.fn.alert.noConflict = function () {
									return a.fn.alert = d,
									this
								},
								a(document).on("click.alert.data-api", b, c.prototype.close)
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (b, c) {
									this.$element = a(b),
									this.options = a.extend({}, a.fn.button.defaults, c)
								};
								b.prototype.setState = function (a) {
									var b = "disabled",
									c = this.$element,
									d = c.data(),
									e = c.is("input") ? "val" : "html";
									a += "Text",
									d.resetText || c.data("resetText", c[e]()),
									c[e](d[a] || this.options[a]),
									setTimeout(function () {
										"loadingText" == a ? c.addClass(b).attr(b, b) : c.removeClass(b).removeAttr(b)
									}, 0)
								},
								b.prototype.toggle = function () {
									var a = this.$element.closest('[data-toggle="buttons-radio"]');
									a && a.find(".active").removeClass("active"),
									this.$element.toggleClass("active")
								};
								var c = a.fn.button;
								a.fn.button = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("button"),
										f = "object" == typeof c && c;
										e || d.data("button", e = new b(this, f)),
										"toggle" == c ? e.toggle() : c && e.setState(c)
									})
								},
								a.fn.button.defaults = {
									loadingText : "loading..."
								},
								a.fn.button.Constructor = b,
								a.fn.button.noConflict = function () {
									return a.fn.button = c,
									this
								},
								a(document).on("click.button.data-api", "[data-toggle^=button]", function (b) {
									var c = a(b.target);
									c.hasClass("btn") || (c = c.closest(".btn")),
									c.button("toggle")
								})
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (b, c) {
									this.$element = a(b),
									this.options = c,
									"hover" == this.options.pause && this.$element.on("mouseenter", a.proxy(this.pause, this)).on("mouseleave", a.proxy(this.cycle, this))
								};
								b.prototype = {
									cycle : function (b) {
										return b || (this.paused = !1),
										this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)),
										this
									},
									to : function (b) {
										var c = this.$element.find(".item.active"),
										d = c.parent().children(),
										e = d.index(c),
										f = this;
										if (!(b > d.length - 1 || 0 > b))
											return this.sliding ? this.$element.one("slid", function () {
												f.to(b)
											}) : e == b ? this.pause().cycle() : this.slide(b > e ? "next" : "prev", a(d[b]))
									},
									pause : function (b) {
										return b || (this.paused = !0),
										this.$element.find(".next, .prev").length && a.support.transition.end && (this.$element.trigger(a.support.transition.end), this.cycle()),
										clearInterval(this.interval),
										this.interval = null,
										this
									},
									next : function () {
										return this.sliding ? void 0 : this.slide("next")
									},
									prev : function () {
										return this.sliding ? void 0 : this.slide("prev")
									},
									slide : function (b, c) {
										var d,
										e = this.$element.find(".item.active"),
										f = c || e[b](),
										g = this.interval,
										h = "next" == b ? "left" : "right",
										i = "next" == b ? "first" : "last",
										j = this;
										if (this.sliding = !0, g && this.pause(), f = f.length ? f : this.$element.find(".item")[i](), d = a.Event("slide", {
													relatedTarget : f[0]
												}), !f.hasClass("active")) {
											if (a.support.transition && this.$element.hasClass("slide")) {
												if (this.$element.trigger(d), d.isDefaultPrevented())
													return;
												f.addClass(b),
												f[0].offsetWidth,
												e.addClass(h),
												f.addClass(h),
												this.$element.one(a.support.transition.end, function () {
													f.removeClass([b, h].join(" ")).addClass("active"),
													e.removeClass(["active", h].join(" ")),
													j.sliding = !1,
													setTimeout(function () {
														j.$element.trigger("slid")
													}, 0)
												})
											} else {
												if (this.$element.trigger(d), d.isDefaultPrevented())
													return;
												e.removeClass("active"),
												f.addClass("active"),
												this.sliding = !1,
												this.$element.trigger("slid")
											}
											return g && this.cycle(),
											this
										}
									}
								};
								var c = a.fn.carousel;
								a.fn.carousel = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("carousel"),
										f = a.extend({}, a.fn.carousel.defaults, "object" == typeof c && c),
										g = "string" == typeof c ? c : f.slide;
										e || d.data("carousel", e = new b(this, f)),
										"number" == typeof c ? e.to(c) : g ? e[g]() : f.interval && e.cycle()
									})
								},
								a.fn.carousel.defaults = {
									interval : 5e3,
									pause : "hover"
								},
								a.fn.carousel.Constructor = b,
								a.fn.carousel.noConflict = function () {
									return a.fn.carousel = c,
									this
								},
								a(document).on("click.carousel.data-api", "[data-slide]", function (b) {
									var c,
									d = a(this),
									e = a(d.attr("data-target") || (c = d.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "")),
									f = a.extend({}, e.data(), d.data());
									e.carousel(f),
									b.preventDefault()
								})
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (b, c) {
									this.$element = a(b),
									this.options = a.extend({}, a.fn.collapse.defaults, c),
									this.options.parent && (this.$parent = a(this.options.parent)),
									this.options.toggle && this.toggle()
								};
								b.prototype = {
									constructor : b,
									dimension : function () {
										var a = this.$element.hasClass("width");
										return a ? "width" : "height"
									},
									show : function () {
										var b,
										c,
										d,
										e;
										if (!this.transitioning) {
											if (b = this.dimension(), c = a.camelCase(["scroll", b].join("-")), d = this.$parent && this.$parent.find("> .accordion-group > .in"), d && d.length) {
												if (e = d.data("collapse"), e && e.transitioning)
													return;
												d.collapse("hide"),
												e || d.data("collapse", null)
											}
											this.$element[b](0),
											this.transition("addClass", a.Event("show"), "shown"),
											a.support.transition && this.$element[b](this.$element[0][c])
										}
									},
									hide : function () {
										var b;
										this.transitioning || (b = this.dimension(), this.reset(this.$element[b]()), this.transition("removeClass", a.Event("hide"), "hidden"), this.$element[b](0))
									},
									reset : function (a) {
										var b = this.dimension();
										return this.$element.removeClass("collapse")[b](a || "auto")[0].offsetWidth,
										this.$element[null !== a ? "addClass" : "removeClass"]("collapse"),
										this
									},
									transition : function (b, c, d) {
										var e = this,
										f = function () {
											"show" == c.type && e.reset(),
											e.transitioning = 0,
											e.$element.trigger(d)
										};
										this.$element.trigger(c),
										c.isDefaultPrevented() || (this.transitioning = 1, this.$element[b]("in"), a.support.transition && this.$element.hasClass("collapse") ? this.$element.one(a.support.transition.end, f) : f())
									},
									toggle : function () {
										this[this.$element.hasClass("in") ? "hide" : "show"]()
									}
								};
								var c = a.fn.collapse;
								a.fn.collapse = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("collapse"),
										f = "object" == typeof c && c;
										e || d.data("collapse", e = new b(this, f)),
										"string" == typeof c && e[c]()
									})
								},
								a.fn.collapse.defaults = {
									toggle : !0
								},
								a.fn.collapse.Constructor = b,
								a.fn.collapse.noConflict = function () {
									return a.fn.collapse = c,
									this
								},
								a(document).on("click.collapse.data-api", "[data-toggle=collapse]", function (b) {
									var c,
									d = a(this),
									e = d.attr("data-target") || b.preventDefault() || (c = d.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, ""),
									f = a(e).data("collapse") ? "toggle" : d.data();
									d[a(e).hasClass("in") ? "addClass" : "removeClass"]("collapsed"),
									a(e).collapse(f)
								})
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								function b() {
									a(d).each(function () {
										c(a(this)).removeClass("open")
									})
								}
								function c(b) {
									var c,
									d = b.attr("data-target");
									return d || (d = b.attr("href"), d = d && /#/.test(d) && d.replace(/.*(?=#[^\s]*$)/, "")),
									c = a(d),
									c.length || (c = b.parent()),
									c
								}
								var d = "[data-toggle=dropdown]",
								e = function (b) {
									var c = a(b).on("click.dropdown.data-api", this.toggle);
									a("html").on("click.dropdown.data-api", function () {
										c.parent().removeClass("open")
									})
								};
								e.prototype = {
									constructor : e,
									toggle : function () {
										var d,
										e,
										f = a(this);
										if (!f.is(".disabled, :disabled"))
											return d = c(f), e = d.hasClass("open"), b(), e || d.toggleClass("open"), f.focus(), !1
									},
									keydown : function (b) {
										var d,
										e,
										f,
										g,
										h;
										if (/(38|40|27)/.test(b.keyCode) && (d = a(this), b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled"))) {
											if (f = c(d), g = f.hasClass("open"), !g || g && 27 == b.keyCode)
												return d.click();
											e = a("[role=menu] li:not(.divider):visible a", f),
											e.length && (h = e.index(e.filter(":focus")), 38 == b.keyCode && h > 0 && h--, 40 == b.keyCode && h < e.length - 1 && h++, ~h || (h = 0), e.eq(h).focus())
										}
									}
								};
								var f = a.fn.dropdown;
								a.fn.dropdown = function (b) {
									return this.each(function () {
										var c = a(this),
										d = c.data("dropdown");
										d || c.data("dropdown", d = new e(this)),
										"string" == typeof b && d[b].call(c)
									})
								},
								a.fn.dropdown.Constructor = e,
								a.fn.dropdown.noConflict = function () {
									return a.fn.dropdown = f,
									this
								},
								a(document).on("click.dropdown.data-api touchstart.dropdown.data-api", b).on("click.dropdown touchstart.dropdown.data-api", ".dropdown form", function (a) {
									a.stopPropagation()
								}).on("touchstart.dropdown.data-api", ".dropdown-menu", function (a) {
									a.stopPropagation()
								}).on("click.dropdown.data-api touchstart.dropdown.data-api", d, e.prototype.toggle).on("keydown.dropdown.data-api touchstart.dropdown.data-api", d + ", [role=menu]", e.prototype.keydown).on("selectablestart", b)
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (b, c) {
									this.options = c,
									this.$element = a(b).delegate('[data-dismiss="modal"]', "click.dismiss.modal", a.proxy(this.hide, this)),
									this.options.remote && this.$element.find(".modal-body").load(this.options.remote)
								};
								b.prototype = {
									constructor : b,
									toggle : function () {
										return this[this.isShown ? "hide" : "show"]()
									},
									show : function () {
										var b = this,
										c = a.Event("show");
										this.$element.trigger(c),
										this.isShown || c.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.backdrop(function () {
												var c = a.support.transition && b.$element.hasClass("fade");
												b.$element.parent().length || b.$element.appendTo(document.body),
												b.$element.show(),
												c && b.$element[0].offsetWidth,
												b.$element.addClass("in").attr("aria-hidden", !1),
												b.enforceFocus(),
												c ? b.$element.one(a.support.transition.end, function () {
													b.$element.focus().trigger("shown")
												}) : b.$element.focus().trigger("shown")
											}))
									},
									hide : function (b) {
										b && b.preventDefault(),
										b = a.Event("hide"),
										this.$element.trigger(b),
										this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), a(document).off("focusin.modal"), this.$element.removeClass("in").attr("aria-hidden", !0), a.support.transition && this.$element.hasClass("fade") ? this.hideWithTransition() : this.hideModal())
									},
									enforceFocus : function () {
										var b = this;
										a(document).on("focusin.modal", function (a) {
											b.$element[0] === a.target || b.$element.has(a.target).length || b.$element.focus()
										})
									},
									escape : function () {
										var a = this;
										this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.modal", function (b) {
											27 == b.which && a.hide()
										}) : this.isShown || this.$element.off("keyup.dismiss.modal")
									},
									hideWithTransition : function () {
										var b = this,
										c = setTimeout(function () {
												b.$element.off(a.support.transition.end),
												b.hideModal()
											}, 500);
										this.$element.one(a.support.transition.end, function () {
											clearTimeout(c),
											b.hideModal()
										})
									},
									hideModal : function () {
										this.$element.hide().trigger("hidden"),
										this.backdrop()
									},
									removeBackdrop : function () {
										this.$backdrop.remove(),
										this.$backdrop = null
									},
									backdrop : function (b) {
										var c = this.$element.hasClass("fade") ? "fade" : "";
										if (this.isShown && this.options.backdrop) {
											var d = a.support.transition && c;
											this.$backdrop = a('<div class="modal-backdrop ' + c + '" />').appendTo(document.body),
											this.$backdrop.click("static" == this.options.backdrop ? a.proxy(this.$element[0].focus, this.$element[0]) : a.proxy(this.hide, this)),
											d && this.$backdrop[0].offsetWidth,
											this.$backdrop.addClass("in"),
											d ? this.$backdrop.one(a.support.transition.end, b) : b()
										} else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(a.support.transition.end, a.proxy(this.removeBackdrop, this)) : this.removeBackdrop()) : b && b()
									}
								};
								var c = a.fn.modal;
								a.fn.modal = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("modal"),
										f = a.extend({}, a.fn.modal.defaults, d.data(), "object" == typeof c && c);
										e || d.data("modal", e = new b(this, f)),
										"string" == typeof c ? e[c]() : f.show && e.show()
									})
								},
								a.fn.modal.defaults = {
									backdrop : !0,
									keyboard : !0,
									show : !0
								},
								a.fn.modal.Constructor = b,
								a.fn.modal.noConflict = function () {
									return a.fn.modal = c,
									this
								},
								a(document).on("click.modal.data-api", '[data-toggle="modal"]', function (b) {
									var c = a(this),
									d = c.attr("href"),
									e = a(c.attr("data-target") || d && d.replace(/.*(?=#[^\s]+$)/, "")),
									f = e.data("modal") ? "toggle" : a.extend({
											remote : !/#/.test(d) && d
										}, e.data(), c.data());
									b.preventDefault(),
									e.modal(f).one("hide", function () {
										c.focus()
									})
								})
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (a, b) {
									this.init("tooltip", a, b)
								};
								b.prototype = {
									constructor : b,
									init : function (b, c, d) {
										var e,
										f;
										this.type = b,
										this.$element = a(c),
										this.options = this.getOptions(d),
										this.enabled = !0,
										"click" == this.options.trigger ? this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this)) : "manual" != this.options.trigger && (e = "hover" == this.options.trigger ? "mouseenter" : "focus", f = "hover" == this.options.trigger ? "mouseleave" : "blur", this.$element.on(e + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(f + "." + this.type, this.options.selector, a.proxy(this.leave, this))),
										this.options.selector ? this._options = a.extend({}, this.options, {
												trigger : "manual",
												selector : ""
											}) : this.fixTitle()
									},
									getOptions : function (b) {
										return b = a.extend({}, a.fn[this.type].defaults, b, this.$element.data()),
										b.delay && "number" == typeof b.delay && (b.delay = {
												show : b.delay,
												hide : b.delay
											}),
										b
									},
									enter : function (b) {
										var c = a(b.currentTarget)[this.type](this._options).data(this.type);
										return c.options.delay && c.options.delay.show ? (clearTimeout(this.timeout), c.hoverState = "in", this.timeout = setTimeout(function () {
													"in" == c.hoverState && c.show()
												}, c.options.delay.show), void 0) : c.show()
									},
									leave : function (b) {
										var c = a(b.currentTarget)[this.type](this._options).data(this.type);
										return this.timeout && clearTimeout(this.timeout),
										c.options.delay && c.options.delay.hide ? (c.hoverState = "out", this.timeout = setTimeout(function () {
													"out" == c.hoverState && c.hide()
												}, c.options.delay.hide), void 0) : c.hide()
									},
									show : function () {
										var a,
										b,
										c,
										d,
										e,
										f,
										g;
										if (this.hasContent() && this.enabled) {
											switch (a = this.tip(), this.setContent(), this.options.animation && a.addClass("fade"), f = "function" == typeof this.options.placement ? this.options.placement.call(this, a[0], this.$element[0]) : this.options.placement, b = /in/.test(f), a.detach().css({
													top : 0,
													left : 0,
													display : "block"
												}).insertAfter(this.$element), c = this.getPosition(b), d = a[0].offsetWidth, e = a[0].offsetHeight, b ? f.split(" ")[1] : f) {
											case "bottom":
												g = {
													top : c.top + c.height,
													left : c.left + c.width / 2 - d / 2
												};
												break;
											case "top":
												g = {
													top : c.top - e,
													left : c.left + c.width / 2 - d / 2
												};
												break;
											case "left":
												g = {
													top : c.top + c.height / 2 - e / 2,
													left : c.left - d
												};
												break;
											case "right":
												g = {
													top : c.top + c.height / 2 - e / 2,
													left : c.left + c.width
												}
											}
											a.offset(g).addClass(f).addClass("in")
										}
									},
									setContent : function () {
										var a = this.tip(),
										b = this.getTitle();
										a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b),
										a.removeClass("fade in top bottom left right")
									},
									hide : function () {
										function b() {
											var b = setTimeout(function () {
													c.off(a.support.transition.end).detach()
												}, 500);
											c.one(a.support.transition.end, function () {
												clearTimeout(b),
												c.detach()
											})
										}
										var c = this.tip();
										return c.removeClass("in"),
										a.support.transition && this.$tip.hasClass("fade") ? b() : c.detach(),
										this
									},
									fixTitle : function () {
										var a = this.$element;
										(a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").removeAttr("title")
									},
									hasContent : function () {
										return this.getTitle()
									},
									getPosition : function (b) {
										return a.extend({}, b ? {
											top : 0,
											left : 0
										}
											 : this.$element.offset(), {
											width : this.$element[0].offsetWidth,
											height : this.$element[0].offsetHeight
										})
									},
									getTitle : function () {
										var a,
										b = this.$element,
										c = this.options;
										return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
									},
									tip : function () {
										return this.$tip = this.$tip || a(this.options.template)
									},
									validate : function () {
										this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
									},
									enable : function () {
										this.enabled = !0
									},
									disable : function () {
										this.enabled = !1
									},
									toggleEnabled : function () {
										this.enabled = !this.enabled
									},
									toggle : function (b) {
										var c = a(b.currentTarget)[this.type](this._options).data(this.type);
										c[c.tip().hasClass("in") ? "hide" : "show"]()
									},
									destroy : function () {
										this.hide().$element.off("." + this.type).removeData(this.type)
									}
								};
								var c = a.fn.tooltip;
								a.fn.tooltip = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("tooltip"),
										f = "object" == typeof c && c;
										e || d.data("tooltip", e = new b(this, f)),
										"string" == typeof c && e[c]()
									})
								},
								a.fn.tooltip.Constructor = b,
								a.fn.tooltip.defaults = {
									animation : !0,
									placement : "top",
									selector : !1,
									template : '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
									trigger : "hover",
									title : "",
									delay : 0,
									html : !1
								},
								a.fn.tooltip.noConflict = function () {
									return a.fn.tooltip = c,
									this
								}
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (a, b) {
									this.init("popover", a, b)
								};
								b.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype, {
										constructor : b,
										setContent : function () {
											var a = this.tip(),
											b = this.getTitle(),
											c = this.getContent();
											a.find(".popover-title")[this.options.html ? "html" : "text"](b),
											a.find(".popover-content")[this.options.html ? "html" : "text"](c),
											a.removeClass("fade top bottom left right in")
										},
										hasContent : function () {
											return this.getTitle() || this.getContent()
										},
										getContent : function () {
											var a,
											b = this.$element,
											c = this.options;
											return a = b.attr("data-content") || ("function" == typeof c.content ? c.content.call(b[0]) : c.content)
										},
										tip : function () {
											return this.$tip || (this.$tip = a(this.options.template)),
											this.$tip
										},
										destroy : function () {
											this.hide().$element.off("." + this.type).removeData(this.type)
										}
									});
								var c = a.fn.popover;
								a.fn.popover = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("popover"),
										f = "object" == typeof c && c;
										e || d.data("popover", e = new b(this, f)),
										"string" == typeof c && e[c]()
									})
								},
								a.fn.popover.Constructor = b,
								a.fn.popover.defaults = a.extend({}, a.fn.tooltip.defaults, {
										placement : "right",
										trigger : "click",
										content : "",
										template : '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"></div></div></div>'
									}),
								a.fn.popover.noConflict = function () {
									return a.fn.popover = c,
									this
								}
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								function b(b, c) {
									var d,
									e = a.proxy(this.process, this),
									f = a(b).is("body") ? a(window) : a(b);
									this.options = a.extend({}, a.fn.scrollspy.defaults, c),
									this.$scrollElement = f.on("scroll.scroll-spy.data-api", e),
									this.selector = (this.options.target || (d = a(b).attr("href")) && d.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a",
									this.$body = a("body"),
									this.refresh(),
									this.process()
								}
								b.prototype = {
									constructor : b,
									refresh : function () {
										var b,
										c = this;
										this.offsets = a([]),
										this.targets = a([]),
										b = this.$body.find(this.selector).map(function () {
												var b = a(this),
												d = b.data("target") || b.attr("href"),
												e = /^#\w/.test(d) && a(d);
												return e && e.length && [[e.position().top + c.$scrollElement.scrollTop(), d]] || null
											}).sort(function (a, b) {
												return a[0] - b[0]
											}).each(function () {
												c.offsets.push(this[0]),
												c.targets.push(this[1])
											})
									},
									process : function () {
										var a,
										b = this.$scrollElement.scrollTop() + this.options.offset,
										c = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
										d = c - this.$scrollElement.height(),
										e = this.offsets,
										f = this.targets,
										g = this.activeTarget;
										if (b >= d)
											return g != (a = f.last()[0]) && this.activate(a);
										for (a = e.length; a--; )
											g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a])
									},
									activate : function (b) {
										var c,
										d;
										this.activeTarget = b,
										a(this.selector).parent(".active").removeClass("active"),
										d = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
										c = a(d).parent("li").addClass("active"),
										c.parent(".dropdown-menu").length && (c = c.closest("li.dropdown").addClass("active")),
										c.trigger("activate")
									}
								};
								var c = a.fn.scrollspy;
								a.fn.scrollspy = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("scrollspy"),
										f = "object" == typeof c && c;
										e || d.data("scrollspy", e = new b(this, f)),
										"string" == typeof c && e[c]()
									})
								},
								a.fn.scrollspy.Constructor = b,
								a.fn.scrollspy.defaults = {
									offset : 10
								},
								a.fn.scrollspy.noConflict = function () {
									return a.fn.scrollspy = c,
									this
								},
								a(window).on("load", function () {
									a('[data-spy="scroll"]').each(function () {
										var b = a(this);
										b.scrollspy(b.data())
									})
								})
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (b) {
									this.element = a(b)
								};
								b.prototype = {
									constructor : b,
									show : function () {
										var b,
										c,
										d,
										e = this.element,
										f = e.closest("ul:not(.dropdown-menu)"),
										g = e.attr("data-target");
										g || (g = e.attr("href"), g = g && g.replace(/.*(?=#[^\s]*$)/, "")),
										e.parent("li").hasClass("active") || (b = f.find(".active:last a")[0], d = a.Event("show", {
													relatedTarget : b
												}), e.trigger(d), d.isDefaultPrevented() || (c = a(g), this.activate(e.parent("li"), f), this.activate(c, c.parent(), function () {
													e.trigger({
														type : "shown",
														relatedTarget : b
													})
												})))
									},
									activate : function (b, c, d) {
										function e() {
											f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),
											b.addClass("active"),
											g ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"),
											b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active"),
											d && d()
										}
										var f = c.find("> .active"),
										g = d && a.support.transition && f.hasClass("fade");
										g ? f.one(a.support.transition.end, e) : e(),
										f.removeClass("in")
									}
								};
								var c = a.fn.tab;
								a.fn.tab = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("tab");
										e || d.data("tab", e = new b(this)),
										"string" == typeof c && e[c]()
									})
								},
								a.fn.tab.Constructor = b,
								a.fn.tab.noConflict = function () {
									return a.fn.tab = c,
									this
								},
								a(document).on("click.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function (b) {
									b.preventDefault(),
									a(this).tab("show")
								})
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (b, c) {
									this.$element = a(b),
									this.options = a.extend({}, a.fn.typeahead.defaults, c),
									this.matcher = this.options.matcher || this.matcher,
									this.sorter = this.options.sorter || this.sorter,
									this.highlighter = this.options.highlighter || this.highlighter,
									this.updater = this.options.updater || this.updater,
									this.source = this.options.source,
									this.$menu = a(this.options.menu),
									this.shown = !1,
									this.listen()
								};
								b.prototype = {
									constructor : b,
									select : function () {
										var a = this.$menu.find(".active").attr("data-value");
										return this.$element.val(this.updater(a)).change(),
										this.hide()
									},
									updater : function (a) {
										return a
									},
									show : function () {
										var b = a.extend({}, this.$element.position(), {
												height : this.$element[0].offsetHeight
											});
										return this.$menu.insertAfter(this.$element).css({
											top : b.top + b.height,
											left : b.left
										}).show(),
										this.shown = !0,
										this
									},
									hide : function () {
										return this.$menu.hide(),
										this.shown = !1,
										this
									},
									lookup : function () {
										var b;
										return this.query = this.$element.val(),
										!this.query || this.query.length < this.options.minLength ? this.shown ? this.hide() : this : (b = a.isFunction(this.source) ? this.source(this.query, a.proxy(this.process, this)) : this.source, b ? this.process(b) : this)
									},
									process : function (b) {
										var c = this;
										return b = a.grep(b, function (a) {
												return c.matcher(a)
											}),
										b = this.sorter(b),
										b.length ? this.render(b.slice(0, this.options.items)).show() : this.shown ? this.hide() : this
									},
									matcher : function (a) {
										return ~a.toLowerCase().indexOf(this.query.toLowerCase())
									},
									sorter : function (a) {
										for (var b, c = [], d = [], e = []; b = a.shift(); )
											b.toLowerCase().indexOf(this.query.toLowerCase()) ? ~b.indexOf(this.query) ? d.push(b) : e.push(b) : c.push(b);
										return c.concat(d, e)
									},
									highlighter : function (a) {
										var b = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
										return a.replace(new RegExp("(" + b + ")", "ig"), function (a, b) {
											return "<strong>" + b + "</strong>"
										})
									},
									render : function (b) {
										var c = this;
										return b = a(b).map(function (b, d) {
												return b = a(c.options.item).attr("data-value", d),
												b.find("a").html(c.highlighter(d)),
												b[0]
											}),
										b.first().addClass("active"),
										this.$menu.html(b),
										this
									},
									next : function () {
										var b = this.$menu.find(".active").removeClass("active"),
										c = b.next();
										c.length || (c = a(this.$menu.find("li")[0])),
										c.addClass("active")
									},
									prev : function () {
										var a = this.$menu.find(".active").removeClass("active"),
										b = a.prev();
										b.length || (b = this.$menu.find("li").last()),
										b.addClass("active")
									},
									listen : function () {
										this.$element.on("blur", a.proxy(this.blur, this)).on("keypress", a.proxy(this.keypress, this)).on("keyup", a.proxy(this.keyup, this)),
										this.eventSupported("keydown") && this.$element.on("keydown", a.proxy(this.keydown, this)),
										this.$menu.on("click", a.proxy(this.click, this)).on("mouseenter", "li", a.proxy(this.mouseenter, this))
									},
									eventSupported : function (a) {
										var b = a in this.$element;
										return b || (this.$element.setAttribute(a, "return;"), b = "function" == typeof this.$element[a]),
										b
									},
									move : function (a) {
										if (this.shown) {
											switch (a.keyCode) {
											case 9:
											case 13:
											case 27:
												a.preventDefault();
												break;
											case 38:
												a.preventDefault(),
												this.prev();
												break;
											case 40:
												a.preventDefault(),
												this.next()
											}
											a.stopPropagation()
										}
									},
									keydown : function (b) {
										this.suppressKeyPressRepeat = ~a.inArray(b.keyCode, [40, 38, 9, 13, 27]),
										this.move(b)
									},
									keypress : function (a) {
										this.suppressKeyPressRepeat || this.move(a)
									},
									keyup : function (a) {
										switch (a.keyCode) {
										case 40:
										case 38:
										case 16:
										case 17:
										case 18:
											break;
										case 9:
										case 13:
											if (!this.shown)
												return;
											this.select();
											break;
										case 27:
											if (!this.shown)
												return;
											this.hide();
											break;
										default:
											this.lookup()
										}
										a.stopPropagation(),
										a.preventDefault()
									},
									blur : function () {
										var a = this;
										setTimeout(function () {
											a.hide()
										}, 150)
									},
									click : function (a) {
										a.stopPropagation(),
										a.preventDefault(),
										this.select()
									},
									mouseenter : function (b) {
										this.$menu.find(".active").removeClass("active"),
										a(b.currentTarget).addClass("active")
									}
								};
								var c = a.fn.typeahead;
								a.fn.typeahead = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("typeahead"),
										f = "object" == typeof c && c;
										e || d.data("typeahead", e = new b(this, f)),
										"string" == typeof c && e[c]()
									})
								},
								a.fn.typeahead.defaults = {
									source : [],
									items : 8,
									menu : '<ul class="typeahead dropdown-menu"></ul>',
									item : '<li><a href="#"></a></li>',
									minLength : 1
								},
								a.fn.typeahead.Constructor = b,
								a.fn.typeahead.noConflict = function () {
									return a.fn.typeahead = c,
									this
								},
								a(document).on("focus.typeahead.data-api", '[data-provide="typeahead"]', function (b) {
									var c = a(this);
									c.data("typeahead") || (b.preventDefault(), c.typeahead(c.data()))
								})
							}
							(window.jQuery),
							!function (a) {
								"use strict";
								var b = function (b, c) {
									this.options = a.extend({}, a.fn.affix.defaults, c),
									this.$window = a(window).on("scroll.affix.data-api", a.proxy(this.checkPosition, this)).on("click.affix.data-api", a.proxy(function () {
												setTimeout(a.proxy(this.checkPosition, this), 1)
											}, this)),
									this.$element = a(b),
									this.checkPosition()
								};
								b.prototype.checkPosition = function () {
									if (this.$element.is(":visible")) {
										var b,
										c = a(document).height(),
										d = this.$window.scrollTop(),
										e = this.$element.offset(),
										f = this.options.offset,
										g = f.bottom,
										h = f.top,
										i = "affix affix-top affix-bottom";
										"object" != typeof f && (g = h = f),
										"function" == typeof h && (h = f.top()),
										"function" == typeof g && (g = f.bottom()),
										b = null != this.unpin && d + this.unpin <= e.top ? !1 : null != g && e.top + this.$element.height() >= c - g ? "bottom" : null != h && h >= d ? "top" : !1,
										this.affixed !== b && (this.affixed = b, this.unpin = "bottom" == b ? e.top - d : null, this.$element.removeClass(i).addClass("affix" + (b ? "-" + b : "")))
									}
								};
								var c = a.fn.affix;
								a.fn.affix = function (c) {
									return this.each(function () {
										var d = a(this),
										e = d.data("affix"),
										f = "object" == typeof c && c;
										e || d.data("affix", e = new b(this, f)),
										"string" == typeof c && e[c]()
									})
								},
								a.fn.affix.Constructor = b,
								a.fn.affix.defaults = {
									offset : 0
								},
								a.fn.affix.noConflict = function () {
									return a.fn.affix = c,
									this
								},
								a(window).on("load", function () {
									a('[data-spy="affix"]').each(function () {
										var b = a(this),
										c = b.data();
										c.offset = c.offset || {},
										c.offsetBottom && (c.offset.bottom = c.offsetBottom),
										c.offsetTop && (c.offset.top = c.offsetTop),
										b.affix(c)
									})
								})
							}
							(window.jQuery),
							define("bootstrap", ["jquery"], function () {}),
							function (a, b) {
								function c(a, b, c) {
									return [parseInt(a[0], 10) * (n.test(a[0]) ? b / 100 : 1), parseInt(a[1], 10) * (n.test(a[1]) ? c / 100 : 1)]
								}
								function d(b, c) {
									return parseInt(a.css(b, c), 10) || 0
								}
								function e(b) {
									var c = b[0];
									return 9 === c.nodeType ? {
										width : b.width(),
										height : b.height(),
										offset : {
											top : 0,
											left : 0
										}
									}
									 : a.isWindow(c) ? {
										width : b.width(),
										height : b.height(),
										offset : {
											top : b.scrollTop(),
											left : b.scrollLeft()
										}
									}
									 : c.preventDefault ? {
										width : 0,
										height : 0,
										offset : {
											top : c.pageY,
											left : c.pageX
										}
									}
									 : {
										width : b.outerWidth(),
										height : b.outerHeight(),
										offset : b.offset()
									}
								}
								a.ui = a.ui || {};
								var f,
								g = Math.max,
								h = Math.abs,
								i = Math.round,
								j = /left|center|right/,
								k = /top|center|bottom/,
								l = /[\+\-]\d+%?/,
								m = /^\w+/,
								n = /%$/,
								o = a.fn.position;
								a.position = {
									scrollbarWidth : function () {
										if (f !== b)
											return f;
										var c,
										d,
										e = a("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
										g = e.children()[0];
										return a("body").append(e),
										c = g.offsetWidth,
										e.css("overflow", "scroll"),
										d = g.offsetWidth,
										c === d && (d = e[0].clientWidth),
										e.remove(),
										f = c - d
									},
									getScrollInfo : function (b) {
										var c = b.isWindow ? "" : b.element.css("overflow-x"),
										d = b.isWindow ? "" : b.element.css("overflow-y"),
										e = "scroll" === c || "auto" === c && b.width < b.element[0].scrollWidth,
										f = "scroll" === d || "auto" === d && b.height < b.element[0].scrollHeight;
										return {
											width : e ? a.position.scrollbarWidth() : 0,
											height : f ? a.position.scrollbarWidth() : 0
										}
									},
									getWithinInfo : function (b) {
										var c = a(b || window),
										d = a.isWindow(c[0]);
										return {
											element : c,
											isWindow : d,
											offset : c.offset() || {
												left : 0,
												top : 0
											},
											scrollLeft : c.scrollLeft(),
											scrollTop : c.scrollTop(),
											width : d ? c.width() : c.outerWidth(),
											height : d ? c.height() : c.outerHeight()
										}
									}
								},
								a.fn.position = function (b) {
									if (!b || !b.of)
										return o.apply(this, arguments);
									b = a.extend({}, b);
									var f,
									n,
									p,
									q,
									r,
									s,
									t = a(b.of),
									u = a.position.getWithinInfo(b.within),
									v = a.position.getScrollInfo(u),
									w = (b.collision || "flip").split(" "),
									x = {};
									return s = e(t),
									t[0].preventDefault && (b.at = "left top"),
									n = s.width,
									p = s.height,
									q = s.offset,
									r = a.extend({}, q),
									a.each(["my", "at"], function () {
										var a,
										c,
										d = (b[this] || "").split(" ");
										1 === d.length && (d = j.test(d[0]) ? d.concat(["center"]) : k.test(d[0]) ? ["center"].concat(d) : ["center", "center"]),
										d[0] = j.test(d[0]) ? d[0] : "center",
										d[1] = k.test(d[1]) ? d[1] : "center",
										a = l.exec(d[0]),
										c = l.exec(d[1]),
										x[this] = [a ? a[0] : 0, c ? c[0] : 0],
										b[this] = [m.exec(d[0])[0], m.exec(d[1])[0]]
									}),
									1 === w.length && (w[1] = w[0]),
									"right" === b.at[0] ? r.left += n : "center" === b.at[0] && (r.left += n / 2),
									"bottom" === b.at[1] ? r.top += p : "center" === b.at[1] && (r.top += p / 2),
									f = c(x.at, n, p),
									r.left += f[0],
									r.top += f[1],
									this.each(function () {
										var e,
										j,
										k = a(this),
										l = k.outerWidth(),
										m = k.outerHeight(),
										o = d(this, "marginLeft"),
										s = d(this, "marginTop"),
										y = l + o + d(this, "marginRight") + v.width,
										z = m + s + d(this, "marginBottom") + v.height,
										A = a.extend({}, r),
										B = c(x.my, k.outerWidth(), k.outerHeight());
										"right" === b.my[0] ? A.left -= l : "center" === b.my[0] && (A.left -= l / 2),
										"bottom" === b.my[1] ? A.top -= m : "center" === b.my[1] && (A.top -= m / 2),
										A.left += B[0],
										A.top += B[1],
										a.support.offsetFractions || (A.left = i(A.left), A.top = i(A.top)),
										e = {
											marginLeft : o,
											marginTop : s
										},
										a.each(["left", "top"], function (c, d) {
											a.ui.position[w[c]] && a.ui.position[w[c]][d](A, {
												targetWidth : n,
												targetHeight : p,
												elemWidth : l,
												elemHeight : m,
												collisionPosition : e,
												collisionWidth : y,
												collisionHeight : z,
												offset : [f[0] + B[0], f[1] + B[1]],
												my : b.my,
												at : b.at,
												within : u,
												elem : k
											})
										}),
										b.using && (j = function (a) {
											var c = q.left - A.left,
											d = c + n - l,
											e = q.top - A.top,
											f = e + p - m,
											i = {
												target : {
													element : t,
													left : q.left,
													top : q.top,
													width : n,
													height : p
												},
												element : {
													element : k,
													left : A.left,
													top : A.top,
													width : l,
													height : m
												},
												horizontal : 0 > d ? "left" : c > 0 ? "right" : "center",
												vertical : 0 > f ? "top" : e > 0 ? "bottom" : "middle"
											};
											l > n && h(c + d) < n && (i.horizontal = "center"),
											m > p && h(e + f) < p && (i.vertical = "middle"),
											i.important = g(h(c), h(d)) > g(h(e), h(f)) ? "horizontal" : "vertical",
											b.using.call(this, a, i)
										}),
										k.offset(a.extend(A, {
												using : j
											}))
									})
								},
								a.ui.position = {
									fit : {
										left : function (a, b) {
											var c,
											d = b.within,
											e = d.isWindow ? d.scrollLeft : d.offset.left,
											f = d.width,
											h = a.left - b.collisionPosition.marginLeft,
											i = e - h,
											j = h + b.collisionWidth - f - e;
											b.collisionWidth > f ? i > 0 && 0 >= j ? (c = a.left + i + b.collisionWidth - f - e, a.left += i - c) : a.left = j > 0 && 0 >= i ? e : i > j ? e + f - b.collisionWidth : e : i > 0 ? a.left += i : j > 0 ? a.left -= j : a.left = g(a.left - h, a.left)
										},
										top : function (a, b) {
											var c,
											d = b.within,
											e = d.isWindow ? d.scrollTop : d.offset.top,
											f = b.within.height,
											h = a.top - b.collisionPosition.marginTop,
											i = e - h,
											j = h + b.collisionHeight - f - e;
											b.collisionHeight > f ? i > 0 && 0 >= j ? (c = a.top + i + b.collisionHeight - f - e, a.top += i - c) : a.top = j > 0 && 0 >= i ? e : i > j ? e + f - b.collisionHeight : e : i > 0 ? a.top += i : j > 0 ? a.top -= j : a.top = g(a.top - h, a.top)
										}
									},
									flip : {
										left : function (a, b) {
											var c,
											d,
											e = b.within,
											f = e.offset.left + e.scrollLeft,
											g = e.width,
											i = e.isWindow ? e.scrollLeft : e.offset.left,
											j = a.left - b.collisionPosition.marginLeft,
											k = j - i,
											l = j + b.collisionWidth - g - i,
											m = "left" === b.my[0] ? -b.elemWidth : "right" === b.my[0] ? b.elemWidth : 0,
											n = "left" === b.at[0] ? b.targetWidth : "right" === b.at[0] ? -b.targetWidth : 0,
											o = -2 * b.offset[0];
											0 > k ? (c = a.left + m + n + o + b.collisionWidth - g - f, (0 > c || c < h(k)) && (a.left += m + n + o)) : l > 0 && (d = a.left - b.collisionPosition.marginLeft + m + n + o - i, (d > 0 || h(d) < l) && (a.left += m + n + o))
										},
										top : function (a, b) {
											var c,
											d,
											e = b.within,
											f = e.offset.top + e.scrollTop,
											g = e.height,
											i = e.isWindow ? e.scrollTop : e.offset.top,
											j = a.top - b.collisionPosition.marginTop,
											k = j - i,
											l = j + b.collisionHeight - g - i,
											m = "top" === b.my[1],
											n = m ? -b.elemHeight : "bottom" === b.my[1] ? b.elemHeight : 0,
											o = "top" === b.at[1] ? b.targetHeight : "bottom" === b.at[1] ? -b.targetHeight : 0,
											p = -2 * b.offset[1];
											0 > k ? (d = a.top + n + o + p + b.collisionHeight - g - f, a.top + n + o + p > k && (0 > d || d < h(k)) && (a.top += n + o + p)) : l > 0 && (c = a.top - b.collisionPosition.marginTop + n + o + p - i, a.top + n + o + p > l && (c > 0 || h(c) < l) && (a.top += n + o + p))
										}
									},
									flipfit : {
										left : function () {
											a.ui.position.flip.left.apply(this, arguments),
											a.ui.position.fit.left.apply(this, arguments)
										},
										top : function () {
											a.ui.position.flip.top.apply(this, arguments),
											a.ui.position.fit.top.apply(this, arguments)
										}
									}
								},
								function () {
									var b,
									c,
									d,
									e,
									f,
									g = document.getElementsByTagName("body")[0],
									h = document.createElement("div");
									b = document.createElement(g ? "div" : "body"),
									d = {
										visibility : "hidden",
										width : 0,
										height : 0,
										border : 0,
										margin : 0,
										background : "none"
									},
									g && a.extend(d, {
										position : "absolute",
										left : "-1000px",
										top : "-1000px"
									});
									for (f in d)
										b.style[f] = d[f];
									b.appendChild(h),
									c = g || document.documentElement,
									c.insertBefore(b, c.firstChild),
									h.style.cssText = "position: absolute; left: 10.7432222px;",
									e = a(h).offset().left,
									a.support.offsetFractions = e > 10 && 11 > e,
									b.innerHTML = "",
									c.removeChild(b)
								}
								()
							}
							(jQuery),
							define("position", ["jquery"], function () {}),
							function (a, b) {
								function c(a) {
									for (var b, c = a.split(/\s+/), d = [], e = 0; b = c[e]; e++)
										b = b[0].toUpperCase(), d.push(b);
									return d
								}
								function d(b) {
									return b.id && a('label[for="' + b.id + '"]').val() || b.name
								}
								function e(c, f, g) {
									return g || (g = 0),
									f.each(function () {
										var f,
										h,
										i = a(this),
										j = this,
										k = this.nodeName.toLowerCase();
										switch ("label" == k && i.find("input, textarea, select").length && (f = i.text(), i = i.children().first(), j = i.get(0), k = j.nodeName.toLowerCase()), k) {
										case "menu":
											h = {
												name : i.attr("label"),
												items : {}

											},
											g = e(h.items, i.children(), g);
											break;
										case "a":
										case "button":
											h = {
												name : i.text(),
												disabled : !!i.attr("disabled"),
												callback : function () {
													return function () {
														i.click()
													}
												}
												()
											};
											break;
										case "menuitem":
										case "command":
											switch (i.attr("type")) {
											case b:
											case "command":
											case "menuitem":
												h = {
													name : i.attr("label"),
													disabled : !!i.attr("disabled"),
													callback : function () {
														return function () {
															i.click()
														}
													}
													()
												};
												break;
											case "checkbox":
												h = {
													type : "checkbox",
													disabled : !!i.attr("disabled"),
													name : i.attr("label"),
													selected : !!i.attr("checked")
												};
												break;
											case "radio":
												h = {
													type : "radio",
													disabled : !!i.attr("disabled"),
													name : i.attr("label"),
													radio : i.attr("radiogroup"),
													value : i.attr("id"),
													selected : !!i.attr("checked")
												};
												break;
											default:
												h = b
											}
											break;
										case "hr":
											h = "-------";
											break;
										case "input":
											switch (i.attr("type")) {
											case "text":
												h = {
													type : "text",
													name : f || d(j),
													disabled : !!i.attr("disabled"),
													value : i.val()
												};
												break;
											case "checkbox":
												h = {
													type : "checkbox",
													name : f || d(j),
													disabled : !!i.attr("disabled"),
													selected : !!i.attr("checked")
												};
												break;
											case "radio":
												h = {
													type : "radio",
													name : f || d(j),
													disabled : !!i.attr("disabled"),
													radio : !!i.attr("name"),
													value : i.val(),
													selected : !!i.attr("checked")
												};
												break;
											default:
												h = b
											}
											break;
										case "select":
											h = {
												type : "select",
												name : f || d(j),
												disabled : !!i.attr("disabled"),
												selected : i.val(),
												options : {}

											},
											i.children().each(function () {
												h.options[this.value] = a(this).text()
											});
											break;
										case "textarea":
											h = {
												type : "textarea",
												name : f || d(j),
												disabled : !!i.attr("disabled"),
												value : i.val()
											};
											break;
										case "label":
											break;
										default:
											h = {
												type : "html",
												html : i.clone(!0)
											}
										}
										h && (g++, c["key" + g] = h)
									}),
									g
								}
								if (a.support.htmlMenuitem = "HTMLMenuItemElement" in window, a.support.htmlCommand = "HTMLCommandElement" in window, a.support.eventSelectstart = "onselectstart" in document.documentElement, !a.ui || !a.ui.widget) {
									var f = a.cleanData;
									a.cleanData = function (b) {
										for (var c, d = 0; null != (c = b[d]); d++)
											try {
												a(c).triggerHandler("remove")
											} catch (e) {}

										f(b)
									}
								}
								var g = null,
								h = !1,
								i = a(window),
								j = 0,
								k = {},
								l = {},
								m = {},
								n = {
									selector : null,
									appendTo : null,
									trigger : "right",
									autoHide : !1,
									delay : 200,
									reposition : !0,
									determinePosition : function (b) {
										if (a.ui && a.ui.position)
											b.css("display", "block").position({
												my : "center top",
												at : "center bottom",
												of : this,
												offset : "0 5",
												collision : "fit"
											}).css("display", "none");
										else {
											var c = this.offset();
											c.top += this.outerHeight(),
											c.left += this.outerWidth() / 2 - b.outerWidth() / 2,
											b.css(c)
										}
									},
									position : function (a, b, c) {
										var d;
										if (!b && !c)
											return a.determinePosition.call(this, a.$menu), void 0;
										d = "maintain" === b && "maintain" === c ? a.$menu.position() : {
											top : c,
											left : b
										};
										var e = i.scrollTop() + i.height(),
										f = i.scrollLeft() + i.width(),
										g = a.$menu.height(),
										h = a.$menu.width();
										d.top + g > e && (d.top -= g),
										d.left + h > f && (d.left -= h),
										a.$menu.css(d)
									},
									positionSubmenu : function (b) {
										if (a.ui && a.ui.position)
											b.css("display", "block").position({
												my : "left top",
												at : "right top",
												of : this,
												collision : "flipfit fit"
											}).css("display", "");
										else {
											var c = {
												top : 0,
												left : this.outerWidth()
											};
											b.css(c)
										}
									},
									zIndex : 1,
									animation : {
										duration : 50,
										show : "slideDown",
										hide : "slideUp"
									},
									events : {
										show : a.noop,
										hide : a.noop
									},
									callback : null,
									items : {}

								},
								o = {
									timer : null,
									pageX : null,
									pageY : null
								},
								p = function (a) {
									for (var b = 0, c = a; ; )
										if (b = Math.max(b, parseInt(c.css("z-index"), 10) || 0), c = c.parent(), !c || !c.length || "html body".indexOf(c.prop("nodeName").toLowerCase()) > -1)
											break;
									return b
								},
								q = {
									abortevent : function (a) {
										a.preventDefault(),
										a.stopImmediatePropagation()
									},
									contextmenu : function (b) {
										var c = a(this);
										if (b.preventDefault(), b.stopImmediatePropagation(), !("right" != b.data.trigger && b.originalEvent || c.hasClass("context-menu-active") || c.hasClass("context-menu-disabled"))) {
											if (g = c, b.data.build) {
												var d = b.data.build(g, b);
												if (d === !1)
													return;
												if (b.data = a.extend(!0, {}, n, b.data, d || {}), !b.data.items || a.isEmptyObject(b.data.items))
													throw window.console && (console.error || console.log)("No items specified to show in contextMenu"), new Error("No Items specified");
												b.data.$trigger = g,
												r.create(b.data)
											}
											r.show.call(c, b.data, b.pageX, b.pageY)
										}
									},
									click : function (b) {
										b.preventDefault(),
										b.stopImmediatePropagation(),
										a(this).trigger(a.Event("contextmenu", {
												data : b.data,
												pageX : b.pageX,
												pageY : b.pageY
											}))
									},
									mousedown : function (b) {
										var c = a(this);
										g && g.length && !g.is(c) && g.data("contextMenu").$menu.trigger("contextmenu:hide"),
										2 == b.button && (g = c.data("contextMenuActive", !0))
									},
									mouseup : function (b) {
										var c = a(this);
										c.data("contextMenuActive") && g && g.length && g.is(c) && !c.hasClass("context-menu-disabled") && (b.preventDefault(), b.stopImmediatePropagation(), g = c, c.trigger(a.Event("contextmenu", {
													data : b.data,
													pageX : b.pageX,
													pageY : b.pageY
												}))),
										c.removeData("contextMenuActive")
									},
									mouseenter : function (b) {
										var c = a(this),
										d = a(b.relatedTarget),
										e = a(document);
										d.is(".context-menu-list") || d.closest(".context-menu-list").length || g && g.length || (o.pageX = b.pageX, o.pageY = b.pageY, o.data = b.data, e.on("mousemove.contextMenuShow", q.mousemove), o.timer = setTimeout(function () {
													o.timer = null,
													e.off("mousemove.contextMenuShow"),
													g = c,
													c.trigger(a.Event("contextmenu", {
															data : o.data,
															pageX : o.pageX,
															pageY : o.pageY
														}))
												}, b.data.delay))
									},
									mousemove : function (a) {
										o.pageX = a.pageX,
										o.pageY = a.pageY
									},
									mouseleave : function (b) {
										var c = a(b.relatedTarget);
										if (!c.is(".context-menu-list") && !c.closest(".context-menu-list").length) {
											try {
												clearTimeout(o.timer)
											} catch (b) {}

											o.timer = null
										}
									},
									layerClick : function (b) {
										var c,
										d,
										e = a(this),
										f = e.data("contextMenuRoot"),
										g = b.button,
										h = b.pageX,
										j = b.pageY;
										b.preventDefault(),
										b.stopImmediatePropagation(),
										setTimeout(function () {
											var e,
											k = "left" == f.trigger && 0 === g || "right" == f.trigger && 2 === g;
											if (document.elementFromPoint && (f.$layer.hide(), c = document.elementFromPoint(h - i.scrollLeft(), j - i.scrollTop()), f.$layer.show()), f.reposition && k)
												if (document.elementFromPoint) {
													if (f.$trigger.is(c) || f.$trigger.has(c).length)
														return f.position.call(f.$trigger, f, h, j), void 0
												} else if (d = f.$trigger.offset(), e = a(window), d.top += e.scrollTop(), d.top <= b.pageY && (d.left += e.scrollLeft(), d.left <= b.pageX && (d.bottom = d.top + f.$trigger.outerHeight(), d.bottom >= b.pageY && (d.right = d.left + f.$trigger.outerWidth(), d.right >= b.pageX))))
													return f.position.call(f.$trigger, f, h, j), void 0;
											c && k && f.$trigger.one("contextmenu:hidden", function () {
												a(c).contextMenu({
													x : h,
													y : j
												})
											}),
											f.$menu.trigger("contextmenu:hide")
										}, 50)
									},
									keyStop : function (a, b) {
										b.isInput || a.preventDefault(),
										a.stopPropagation()
									},
									key : function (a) {
										var b = g.data("contextMenu") || {};
										switch (a.keyCode) {
										case 9:
										case 38:
											if (q.keyStop(a, b), b.isInput) {
												if (9 == a.keyCode && a.shiftKey)
													return a.preventDefault(), b.$selected && b.$selected.find("input, textarea, select").blur(), b.$menu.trigger("prevcommand"), void 0;
												if (38 == a.keyCode && "checkbox" == b.$selected.find("input, textarea, select").prop("type"))
													return a.preventDefault(), void 0
											} else if (9 != a.keyCode || a.shiftKey)
												return b.$menu.trigger("prevcommand"), void 0;
										case 40:
											if (q.keyStop(a, b), !b.isInput)
												return b.$menu.trigger("nextcommand"), void 0;
											if (9 == a.keyCode)
												return a.preventDefault(), b.$selected && b.$selected.find("input, textarea, select").blur(), b.$menu.trigger("nextcommand"), void 0;
											if (40 == a.keyCode && "checkbox" == b.$selected.find("input, textarea, select").prop("type"))
												return a.preventDefault(), void 0;
											break;
										case 37:
											if (q.keyStop(a, b), b.isInput || !b.$selected || !b.$selected.length)
												break;
											if (!b.$selected.parent().hasClass("context-menu-root")) {
												var c = b.$selected.parent().parent();
												return b.$selected.trigger("contextmenu:blur"),
												b.$selected = c,
												void 0
											}
											break;
										case 39:
											if (q.keyStop(a, b), b.isInput || !b.$selected || !b.$selected.length)
												break;
											var d = b.$selected.data("contextMenu") || {};
											if (d.$menu && b.$selected.hasClass("context-menu-submenu"))
												return b.$selected = null, d.$selected = null, d.$menu.trigger("nextcommand"), void 0;
											break;
										case 35:
										case 36:
											return b.$selected && b.$selected.find("input, textarea, select").length ? void 0 : ((b.$selected && b.$selected.parent() || b.$menu).children(":not(.disabled, .not-selectable)")[36 == a.keyCode ? "first" : "last"]().trigger("contextmenu:focus"), a.preventDefault(), void 0);
										case 13:
											if (q.keyStop(a, b), b.isInput) {
												if (b.$selected && !b.$selected.is("textarea, select"))
													return a.preventDefault(), void 0;
												break
											}
											return b.$selected && b.$selected.trigger("mouseup"),
											void 0;
										case 32:
										case 33:
										case 34:
											return q.keyStop(a, b),
											void 0;
										case 27:
											return q.keyStop(a, b),
											b.$menu.trigger("contextmenu:hide"),
											void 0;
										default:
											var e = String.fromCharCode(a.keyCode).toUpperCase();
											if (b.accesskeys[e])
												return b.accesskeys[e].$node.trigger(b.accesskeys[e].$menu ? "contextmenu:focus" : "mouseup"), void 0
										}
										a.stopPropagation(),
										b.$selected && b.$selected.trigger(a)
									},
									prevItem : function (b) {
										b.stopPropagation();
										var c = a(this).data("contextMenu") || {};
										if (c.$selected) {
											var d = c.$selected;
											c = c.$selected.parent().data("contextMenu") || {},
											c.$selected = d
										}
										for (var e = c.$menu.children(), f = c.$selected && c.$selected.prev().length ? c.$selected.prev() : e.last(), g = f; f.hasClass("disabled") || f.hasClass("not-selectable"); )
											if (f = f.prev().length ? f.prev() : e.last(), f.is(g))
												return;
										c.$selected && q.itemMouseleave.call(c.$selected.get(0), b),
										q.itemMouseenter.call(f.get(0), b);
										var h = f.find("input, textarea, select");
										h.length && h.focus()
									},
									nextItem : function (b) {
										b.stopPropagation();
										var c = a(this).data("contextMenu") || {};
										if (c.$selected) {
											var d = c.$selected;
											c = c.$selected.parent().data("contextMenu") || {},
											c.$selected = d
										}
										for (var e = c.$menu.children(), f = c.$selected && c.$selected.next().length ? c.$selected.next() : e.first(), g = f; f.hasClass("disabled") || f.hasClass("not-selectable"); )
											if (f = f.next().length ? f.next() : e.first(), f.is(g))
												return;
										c.$selected && q.itemMouseleave.call(c.$selected.get(0), b),
										q.itemMouseenter.call(f.get(0), b);
										var h = f.find("input, textarea, select");
										h.length && h.focus()
									},
									focusInput : function () {
										var b = a(this).closest(".context-menu-item"),
										c = b.data(),
										d = c.contextMenu,
										e = c.contextMenuRoot;
										e.$selected = d.$selected = b,
										e.isInput = d.isInput = !0
									},
									blurInput : function () {
										var b = a(this).closest(".context-menu-item"),
										c = b.data(),
										d = c.contextMenu,
										e = c.contextMenuRoot;
										e.isInput = d.isInput = !1
									},
									menuMouseenter : function () {
										var b = a(this).data().contextMenuRoot;
										b.hovering = !0
									},
									menuMouseleave : function (b) {
										var c = a(this).data().contextMenuRoot;
										c.$layer && c.$layer.is(b.relatedTarget) && (c.hovering = !1)
									},
									itemMouseenter : function (b) {
										var c = a(this),
										d = c.data(),
										e = d.contextMenu,
										f = d.contextMenuRoot;
										return f.hovering = !0,
										b && f.$layer && f.$layer.is(b.relatedTarget) && (b.preventDefault(), b.stopImmediatePropagation()),
										(e.$menu ? e : f).$menu.children(".hover").trigger("contextmenu:blur"),
										c.hasClass("disabled") || c.hasClass("not-selectable") ? (e.$selected = null, void 0) : (c.trigger("contextmenu:focus"), void 0)
									},
									itemMouseleave : function (b) {
										var c = a(this),
										d = c.data(),
										e = d.contextMenu,
										f = d.contextMenuRoot;
										return f !== e && f.$layer && f.$layer.is(b.relatedTarget) ? (f.$selected && f.$selected.trigger("contextmenu:blur"), b.preventDefault(), b.stopImmediatePropagation(), f.$selected = e.$selected = e.$node, void 0) : (c.trigger("contextmenu:blur"), void 0)
									},
									itemClick : function (b) {
										var c,
										d = a(this),
										e = d.data(),
										f = e.contextMenu,
										g = e.contextMenuRoot,
										h = e.contextMenuKey;
										if (f.items[h] && !d.is(".disabled, .context-menu-submenu, .context-menu-separator, .not-selectable")) {
											if (b.preventDefault(), b.stopImmediatePropagation(), a.isFunction(g.callbacks[h]) && Object.prototype.hasOwnProperty.call(g.callbacks, h))
												c = g.callbacks[h];
											else {
												if (!a.isFunction(g.callback))
													return;
												c = g.callback
											}
											c.call(g.$trigger, h, g) !== !1 ? g.$menu.trigger("contextmenu:hide") : g.$menu.parent().length && r.update.call(g.$trigger, g)
										}
									},
									inputClick : function (a) {
										a.stopImmediatePropagation()
									},
									hideMenu : function (b, c) {
										var d = a(this).data("contextMenuRoot");
										r.hide.call(d.$trigger, d, c && c.force)
									},
									focusItem : function (b) {
										b.stopPropagation();
										var c = a(this),
										d = c.data(),
										e = d.contextMenu,
										f = d.contextMenuRoot;
										c.addClass("hover").siblings(".hover").trigger("contextmenu:blur"),
										e.$selected = f.$selected = c,
										e.$node && f.positionSubmenu.call(e.$node, e.$menu)
									},
									blurItem : function (b) {
										b.stopPropagation();
										var c = a(this),
										d = c.data(),
										e = d.contextMenu;
										d.contextMenuRoot,
										c.removeClass("hover"),
										e.$selected = null
									}
								},
								r = {
									show : function (b, c, d) {
										var e = a(this),
										f = {};
										return a("#context-menu-layer").trigger("mousedown"),
										b.$trigger = e,
										b.events.show.call(e, b) === !1 ? (g = null, void 0) : (r.update.call(e, b), b.position.call(e, b, c, d), b.zIndex && (f.zIndex = p(e) + b.zIndex), r.layer.call(b.$menu, b, f.zIndex), b.$menu.find("ul").css("zIndex", f.zIndex + 1), b.$menu.css(f)[b.animation.show](b.animation.duration, function () {
												e.trigger("contextmenu:visible")
											}), e.data("contextMenu", b).addClass("context-menu-active"), a(document).off("keydown.contextMenu").on("keydown.contextMenu", q.key), b.autoHide && a(document).on("mousemove.contextMenuAutoHide", function (a) {
												var c = e.offset();
												c.right = c.left + e.outerWidth(),
												c.bottom = c.top + e.outerHeight(),
												!b.$layer || b.hovering || a.pageX >= c.left && a.pageX <= c.right && a.pageY >= c.top && a.pageY <= c.bottom || b.$menu.trigger("contextmenu:hide")
											}), b.events.shown && b.events.shown.call(e, b), void 0)
									},
									hide : function (c, d) {
										var e = a(this);
										if (c || (c = e.data("contextMenu") || {}), d || !c.events || c.events.hide.call(e, c) !== !1) {
											if (e.removeData("contextMenu").removeClass("context-menu-active"), c.$layer) {
												setTimeout(function (a) {
													return function () {
														a.remove()
													}
												}
													(c.$layer), 10);
												try {
													delete c.$layer
												} catch (f) {
													c.$layer = null
												}
											}
											g = null,
											c.$menu.find(".hover").trigger("contextmenu:blur"),
											c.$selected = null,
											a(document).off(".contextMenuAutoHide").off("keydown.contextMenu"),
											c.$menu && c.$menu[c.animation.hide](c.animation.duration, function () {
												c.build && (c.$menu.remove(), a.each(c, function (a) {
														switch (a) {
														case "ns":
														case "selector":
														case "build":
														case "trigger":
															return !0;
														default:
															c[a] = b;
															try {
																delete c[a]
															} catch (d) {}

															return !0
														}
													})),
												setTimeout(function () {
													e.trigger("contextmenu:hidden")
												}, 10)
											})
										}
									},
									create : function (d, e) {
										e === b && (e = d),
										d.$menu = a('<ul class="context-menu-list"></ul>').addClass(d.className || "").data({
												contextMenu : d,
												contextMenuRoot : e
											}),
										a.each(["callbacks", "commands", "inputs"], function (a, b) {
											d[b] = {},
											e[b] || (e[b] = {})
										}),
										e.accesskeys || (e.accesskeys = {}),
										a.each(d.items, function (b, f) {
											var g = a('<li class="context-menu-item"></li>').addClass(f.className || ""),
											h = null,
											i = null;
											if (g.on("click", a.noop), f.$node = g.data({
														contextMenu : d,
														contextMenuRoot : e,
														contextMenuKey : b
													}), f.accesskey)
												for (var j, k = c(f.accesskey), l = 0; j = k[l]; l++)
													if (!e.accesskeys[j]) {
														e.accesskeys[j] = f,
														f._name = f.name.replace(new RegExp("(" + j + ")", "i"), '<span class="context-menu-accesskey">$1</span>');
														break
													}
											if ("string" == typeof f)
												g.addClass("context-menu-separator not-selectable");
											else if (f.type && m[f.type])
												m[f.type].call(g, f, d, e), a.each([d, e], function (c, d) {
													d.commands[b] = f,
													a.isFunction(f.callback) && (d.callbacks[b] = f.callback)
												});
											else {
												switch ("html" == f.type ? g.addClass("context-menu-html not-selectable") : f.type ? (h = a("<label></label>").appendTo(g), a("<span></span>").html(f._name || f.name).appendTo(h), g.addClass("context-menu-input"), d.hasTypes = !0, a.each([d, e], function (a, c) {
															c.commands[b] = f,
															c.inputs[b] = f
														})) : f.items && (f.type = "sub"), f.type) {
												case "text":
													i = a('<input type="text" value="1" name="" value="">').attr("name", "context-menu-input-" + b).val(f.value || "").appendTo(h);
													break;
												case "textarea":
													i = a('<textarea name=""></textarea>').attr("name", "context-menu-input-" + b).val(f.value || "").appendTo(h),
													f.height && i.height(f.height);
													break;
												case "checkbox":
													i = a('<input type="checkbox" value="1" name="" value="">').attr("name", "context-menu-input-" + b).val(f.value || "").prop("checked", !!f.selected).prependTo(h);
													break;
												case "radio":
													i = a('<input type="radio" value="1" name="" value="">').attr("name", "context-menu-input-" + f.radio).val(f.value || "").prop("checked", !!f.selected).prependTo(h);
													break;
												case "select":
													i = a('<select name="">').attr("name", "context-menu-input-" + b).appendTo(h),
													f.options && (a.each(f.options, function (b, c) {
															a("<option></option>").val(b).text(c).appendTo(i)
														}), i.val(f.selected));
													break;
												case "sub":
													a("<span></span>").html(f._name || f.name).appendTo(g),
													f.appendTo = f.$node,
													r.create(f, e),
													g.data("contextMenu", f).addClass("context-menu-submenu"),
													f.callback = null;
													break;
												case "html":
													a(f.html).appendTo(g);
													break;
												default:
													a.each([d, e], function (c, d) {
														d.commands[b] = f,
														a.isFunction(f.callback) && (d.callbacks[b] = f.callback)
													}),
													a("<span></span>").html(f._name || f.name || "").appendTo(g)
												}
												f.type && "sub" != f.type && "html" != f.type && (i.on("focus", q.focusInput).on("blur", q.blurInput), f.events && i.on(f.events, d)),
												f.icon && g.prepend('<i class="icon icon-' + f.icon + '"></i>'),
												f.background && (g.addClass(f.background), g[0].dataset.background = f.background)
											}
											f.$input = i,
											f.$label = h,
											g.appendTo(d.$menu),
											!d.hasTypes && a.support.eventSelectstart && g.on("selectstart.disableTextSelect", q.abortevent)
										}),
										d.$node || d.$menu.css("display", "none").addClass("context-menu-root"),
										d.$menu.appendTo(d.appendTo || document.body)
									},
									resize : function (b, c) {
										b.css({
											position : "absolute",
											display : "block"
										}),
										b.data("width", Math.ceil(b.width()) + 1),
										b.css({
											position : "static",
											minWidth : "0px",
											maxWidth : "100000px"
										}),
										b.find("> li > ul").each(function () {
											r.resize(a(this), !0)
										}),
										c || b.find("ul").andSelf().css({
											position : "",
											display : "",
											minWidth : "",
											maxWidth : ""
										}).width(function () {
											return a(this).data("width")
										})
									},
									update : function (c, d) {
										var e = this;
										d === b && (d = c, r.resize(c.$menu)),
										c.$menu.children().each(function () {
											var b = a(this),
											f = b.data("contextMenuKey"),
											g = c.items[f],
											h = a.isFunction(g.disabled) && g.disabled.call(e, f, d) || g.disabled === !0;
											if (b[h ? "addClass" : "removeClass"]("disabled"), g.type)
												switch (b.find("input, select, textarea").prop("disabled", h), g.type) {
												case "text":
												case "textarea":
													g.$input.val(g.value || "");
													break;
												case "checkbox":
												case "radio":
													g.$input.val(g.value || "").prop("checked", !!g.selected);
													break;
												case "select":
													g.$input.val(g.selected || "")
												}
											g.$menu && r.update.call(e, g, d)
										})
									},
									layer : function (b, c) {
										var d = b.$layer = a('<div id="context-menu-layer" style="position:fixed; z-index:' + c + '; top:0; left:0; opacity: 0; filter: alpha(opacity=0); background-color: #000;"></div>').css({
												height : i.height(),
												width : i.width(),
												display : "block"
											}).data("contextMenuRoot", b).insertBefore(this).on("contextmenu", q.abortevent).on("mousedown", q.layerClick);
										return a.support.fixedPosition || d.css({
											position : "absolute",
											height : a(document).height()
										}),
										d
									}
								};
								a.fn.contextMenu = function (c) {
									if (c === b)
										this.first().trigger("contextmenu");
									else if (c.x && c.y)
										this.first().trigger(a.Event("contextmenu", {
												pageX : c.x,
												pageY : c.y
											}));
									else if ("hide" === c) {
										var d = this.data("contextMenu").$menu;
										d && d.trigger("contextmenu:hide")
									} else
										"destroy" === c ? a.contextMenu("destroy", {
											context : this
										}) : a.isPlainObject(c) ? (c.context = this, a.contextMenu("create", c)) : c ? this.removeClass("context-menu-disabled") : c || this.addClass("context-menu-disabled");
									return this
								},
								a.contextMenu = function (c, d) {
									"string" != typeof c && (d = c, c = "create"),
									"string" == typeof d ? d = {
										selector : d
									}
									 : d === b && (d = {});
									var e = a.extend(!0, {}, n, d || {}),
									f = a(document),
									g = f,
									i = !1;
									switch (e.context && e.context.length ? (g = a(e.context).first(), e.context = g.get(0), i = e.context !== document) : e.context = document, c) {
									case "create":
										if (!e.selector)
											throw new Error("No selector specified");
										if (e.selector.match(/.context-menu-(list|item|input)($|\s)/))
											throw new Error('Cannot bind to selector "' + e.selector + '" as it contains a reserved className');
										if (!e.build && (!e.items || a.isEmptyObject(e.items)))
											throw new Error("No Items specified");
										switch (j++, e.ns = ".contextMenu" + j, i || (k[e.selector] = e.ns), l[e.ns] = e, e.trigger || (e.trigger = "right"), h || (f.on({
													"contextmenu:hide.contextMenu" : q.hideMenu,
													"prevcommand.contextMenu" : q.prevItem,
													"nextcommand.contextMenu" : q.nextItem,
													"contextmenu.contextMenu" : q.abortevent,
													"mouseenter.contextMenu" : q.menuMouseenter,
													"mouseleave.contextMenu" : q.menuMouseleave
												}, ".context-menu-list").on("mouseup.contextMenu", ".context-menu-input", q.inputClick).on({
													"mouseup.contextMenu" : q.itemClick,
													"contextmenu:focus.contextMenu" : q.focusItem,
													"contextmenu:blur.contextMenu" : q.blurItem,
													"contextmenu.contextMenu" : q.abortevent,
													"mouseenter.contextMenu" : q.itemMouseenter,
													"mouseleave.contextMenu" : q.itemMouseleave
												}, ".context-menu-item"), h = !0), g.on("contextmenu" + e.ns, e.selector, e, q.contextmenu), i && g.on("remove" + e.ns, function () {
												a(this).contextMenu("destroy")
											}), e.trigger) {
										case "hover":
											g.on("mouseenter" + e.ns, e.selector, e, q.mouseenter).on("mouseleave" + e.ns, e.selector, e, q.mouseleave);
											break;
										case "left":
											g.on("click" + e.ns, e.selector, e, q.click)
										}
										e.build || r.create(e);
										break;
									case "destroy":
										var m;
										if (i) {
											var o = e.context;
											a.each(l, function (b, c) {
												if (c.context !== o)
													return !0;
												m = a(".context-menu-list").filter(":visible"),
												m.length && m.data().contextMenuRoot.$trigger.is(a(c.context).find(c.selector)) && m.trigger("contextmenu:hide", {
													force : !0
												});
												try {
													l[c.ns].$menu && l[c.ns].$menu.remove(),
													delete l[c.ns]
												} catch (d) {
													l[c.ns] = null
												}
												return a(c.context).off(c.ns),
												!0
											})
										} else if (e.selector) {
											if (k[e.selector]) {
												m = a(".context-menu-list").filter(":visible"),
												m.length && m.data().contextMenuRoot.$trigger.is(e.selector) && m.trigger("contextmenu:hide", {
													force : !0
												});
												try {
													l[k[e.selector]].$menu && l[k[e.selector]].$menu.remove(),
													delete l[k[e.selector]]
												} catch (p) {
													l[k[e.selector]] = null
												}
												f.off(k[e.selector])
											}
										} else
											f.off(".contextMenu .contextMenuAutoHide"), a.each(l, function (b, c) {
												a(c.context).off(c.ns)
											}), k = {},
										l = {},
										j = 0,
										h = !1,
										a("#context-menu-layer, .context-menu-list").remove();
										break;
									case "html5":
										(!a.support.htmlCommand && !a.support.htmlMenuitem || "boolean" == typeof d && d) && a('menu[type="context"]').each(function () {
											this.id && a.contextMenu({
												selector : "[contextmenu=" + this.id + "]",
												items : a.contextMenu.fromMenu(this)
											})
										}).css("display", "none");
										break;
									default:
										throw new Error('Unknown operation "' + c + '"')
									}
									return this
								},
								a.contextMenu.setInputValues = function (c, d) {
									d === b && (d = {}),
									a.each(c.inputs, function (a, b) {
										switch (b.type) {
										case "text":
										case "textarea":
											b.value = d[a] || "";
											break;
										case "checkbox":
											b.selected = d[a] ? !0 : !1;
											break;
										case "radio":
											b.selected = (d[b.radio] || "") == b.value ? !0 : !1;
											break;
										case "select":
											b.selected = d[a] || ""
										}
									})
								},
								a.contextMenu.getInputValues = function (c, d) {
									return d === b && (d = {}),
									a.each(c.inputs, function (a, b) {
										switch (b.type) {
										case "text":
										case "textarea":
										case "select":
											d[a] = b.$input.val();
											break;
										case "checkbox":
											d[a] = b.$input.prop("checked");
											break;
										case "radio":
											b.$input.prop("checked") && (d[b.radio] = b.value)
										}
									}),
									d
								},
								a.contextMenu.fromMenu = function (b) {
									var c = a(b),
									d = {};
									return e(d, c.children()),
									d
								},
								a.contextMenu.defaults = n,
								a.contextMenu.types = m,
								a.contextMenu.handle = q,
								a.contextMenu.op = r,
								a.contextMenu.menus = l
							}
							(jQuery),
							define("jqContextMenu", ["jquery", "position"], function () {}),
							function (a) {
								function b(a, b) {
									if (!(a.originalEvent.touches.length > 1)) {
										a.preventDefault();
										var c = a.originalEvent.changedTouches[0],
										d = document.createEvent("MouseEvents");
										d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null),
										a.target.dispatchEvent(d)
									}
								}
								if (a.support.touch = "ontouchend" in document, a.support.touch) {
									var c,
									d = a.ui.mouse.prototype,
									e = d._mouseInit;
									d._touchStart = function (a) {
										var d = this;
										!c && d._mouseCapture(a.originalEvent.changedTouches[0]) && (c = !0, d._touchMoved = !1, b(a, "mouseover"), b(a, "mousemove"), b(a, "mousedown"))
									},
									d._touchMove = function (a) {
										c && (this._touchMoved = !0, b(a, "mousemove"))
									},
									d._touchEnd = function (a) {
										c && (b(a, "mouseup"), b(a, "mouseout"), this._touchMoved || b(a, "click"), c = !1)
									},
									d._mouseInit = function () {
										var b = this;
										b.element.bind("touchstart", a.proxy(b, "_touchStart")).bind("touchmove", a.proxy(b, "_touchMove")).bind("touchend", a.proxy(b, "_touchEnd")),
										e.call(b)
									}
								}
							}
							(jQuery),
							define("touchpunch", ["jquery", "jqueryui"], function () {}),
							Function.prototype.bind || (Function.prototype.bind = function (a) {
								"use strict";
								if ("function" != typeof this)
									throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
								var b = Array.prototype.slice.call(arguments, 1),
								c = this,
								d = function () {},
								e = function () {
									return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
								};
								return d.prototype = this.prototype,
								e.prototype = new d,
								e
							}),
							function () {
								"use strict";
								var a = Object.prototype,
								b = a.__defineGetter__,
								c = a.__defineSetter__,
								d = a.__lookupGetter__,
								e = a.__lookupSetter__,
								f = a.hasOwnProperty;
								b && c && d && e && (Object.defineProperty || (Object.defineProperty = function (a, g, h) {
										if (arguments.length < 3)
											throw new TypeError("Arguments not optional");
										if (g += "", f.call(h, "value") && (d.call(a, g) || e.call(a, g) || (a[g] = h.value), f.call(h, "get") || f.call(h, "set")))
											throw new TypeError("Cannot specify an accessor and a value");
										if (!(h.writable && h.enumerable && h.configurable))
											throw new TypeError("This implementation of Object.defineProperty does not support false for configurable, enumerable, or writable.");
										return h.get && b.call(a, g, h.get),
										h.set && c.call(a, g, h.set),
										a
									}), Object.getOwnPropertyDescriptor || (Object.getOwnPropertyDescriptor = function (a, b) {
										if (arguments.length < 2)
											throw new TypeError("Arguments not optional.");
										b += "";
										var c = {
											configurable : !0,
											enumerable : !0,
											writable : !0
										},
										g = d.call(a, b),
										h = e.call(a, b);
										return f.call(a, b) ? g || h ? (delete c.writable, c.get = c.set = void 0, g && (c.get = g), h && (c.set = h), c) : (c.value = a[b], c) : c
									}), Object.defineProperties || (Object.defineProperties = function (a, b) {
										var c;
										for (c in b)
											f.call(b, c) && Object.defineProperty(a, c, b[c])
									}))
							}
							(),
							!(document.documentElement.dataset || Object.getOwnPropertyDescriptor(Element.prototype, "dataset") && Object.getOwnPropertyDescriptor(Element.prototype, "dataset").get)) {
								var b = {
									enumerable : !0,
									get : function () {
										"use strict";
										var a,
										b,
										c,
										d,
										e,
										f,
										g = this,
										h = this.attributes,
										i = h.length,
										j = function (a) {
											return a.charAt(1).toUpperCase()
										},
										k = function () {
											return this
										},
										l = function (a, b) {
											return "undefined" != typeof b ? this.setAttribute(a, b) : this.removeAttribute(a)
										};
										try {
											({}).__defineGetter__("test", function () {}),
											b = {}

										} catch (m) {
											b = document.createElement("div")
										}
										for (a = 0; i > a; a++)
											if (f = h[a], f && f.name && /^data-\w[\w\-]*$/.test(f.name)) {
												c = f.value,
												d = f.name,
												e = d.substr(5).replace(/-./g, j);
												try {
													Object.defineProperty(b, e, {
														enumerable : this.enumerable,
														get : k.bind(c || ""),
														set : l.bind(g, d)
													})
												} catch (n) {
													b[e] = c
												}
											}
										return b
									}
								};
								try {
									Object.defineProperty(Element.prototype, "dataset", b)
								} catch (c) {
									b.enumerable = !1,
									Object.defineProperty(Element.prototype, "dataset", b)
								}
							}
							define("preview_export/scripts/dataset-shim", function () {}),
							require.config({
								paths : {
									libs : "../scripts/libs",
									preview_export : "../preview_export",
									jquery : "../scripts/libs/jQuery",
									jqueryui : "../scripts/libs/jquery-ui",
									touchpunch : "../scripts/libs/jquery-ui-touch-punch",
									"jquery.multisortable" : "../scripts/libs/jquery.multisortable",
									position : "../components/jq-contextmenu/jquery.ui.position",
									jqContextMenu : "../components/jq-contextmenu/jquery.contextMenu",
									lodash : "../scripts/libs/lodash",
									backbone : "../scripts/libs/backbone",
									css : "../scripts/libs/css",
									bootstrap : "../components/bootstrap/bootstrap",
									colorpicker : "../components/spectrum/spectrum",
									handlebars : "../scripts/libs/Handlebars",
									lang : "../locales/lang",
									lexed : "../components/lexed/lexed",
									codemirror : "../components/codemirror",
									marked : "../components/marked/marked",
									"strut/presentation_generator/bespoke" : "../bundles/app/strut.presentation_generator.bespoke",
									"strut/presentation_generator/reveal" : "../bundles/app/strut.presentation_generator.reveal",
									"strut/presentation_generator/handouts" : "../bundles/app/strut.presentation_generator.handouts",
									"strut/deck" : "../bundles/app/strut.deck",
									"strut/startup" : "../bundles/app/strut.startup",
									"strut/editor" : "../bundles/app/strut.editor",
									"strut/etch_extension" : "../bundles/app/strut.etch_extension",
									"strut/exporter/zip/browser" : "../bundles/app/strut.exporter.zip.browser",
									"strut/exporter" : "../bundles/app/strut.exporter",
									"strut/exporter/json" : "../bundles/app/strut.exporter.json",
									"strut/header" : "../bundles/app/strut.header",
									"strut/importer" : "../bundles/app/strut.importer",
									"strut/importer/json" : "../bundles/app/strut.importer.json",
									"strut/presentation_generator/impress" : "../bundles/app/strut.presentation_generator.impress",
									"strut/logo_button" : "../bundles/app/strut.logo_button",
									"strut/presentation_generator" : "../bundles/app/strut.presentation_generator",
									"strut/slide_components" : "../bundles/app/strut.slide_components",
									"strut/slide_editor" : "../bundles/app/strut.slide_editor",
									"strut/slide_snapshot" : "../bundles/app/strut.slide_snapshot",
									"strut/storage" : "../bundles/app/strut.storage",
									"strut/themes" : "../bundles/app/strut.themes",
									"strut/well_context_buttons" : "../bundles/app/strut.well_context_buttons",
									"strut/config" : "../bundles/app/strut.config",
									"strut/transition_editor" : "../bundles/app/strut.transition_editor",
									"tantaman/web" : "../bundles/common/tantaman.web",
									"tantaman/web/local_storage" : "../bundles/common/tantaman.web.local_storage",
									"tantaman/web/remote_storage" : "../bundles/common/tantaman.web.remote_storage",
									"tantaman/web/saver" : "../bundles/common/tantaman.web.saver",
									"tantaman/web/storage" : "../bundles/common/tantaman.web.storage",
									"tantaman/web/undo_support" : "../bundles/common/tantaman.web.undo_support",
									"tantaman/web/interactions" : "../bundles/common/tantaman.web.interactions",
									"tantaman/web/widgets" : "../bundles/common/tantaman.web.widgets",
									"tantaman/web/css_manip" : "../bundles/common/tantaman.web.css_manip"
								},
								shim : {
									bootstrap : {
										deps : ["jquery"]
									},
									"jquery.multisortable" : {
										deps : ["jquery", "jqueryui"]
									},
									touchpunch : {
										deps : ["jquery", "jqueryui"]
									},
									jqueryui : {
										deps : ["jquery"]
									},
									colorpicker : {
										deps : ["jquery"]
									},
									gradientPicker : {
										deps : ["jquery", "colorpicker"]
									},
									position : {
										deps : ["jquery"]
									},
									jqContextMenu : {
										deps : ["jquery", "position"]
									},
									"codemirror/codemirror" : {
										deps : ["css!../components/codemirror/codemirror.css"],
										exports : "CodeMirror"
									},
									"codemirror/modes/css" : {
										deps : ["codemirror/codemirror"]
									},
									"codemirror/modes/markdown" : {
										deps : ["codemirror/codemirror"]
									}
								}
							});
							var d = {}

							.hasOwnProperty,
							e = function (a, b) {
								function c() {
									this.constructor = a
								}
								for (var e in b)
									d.call(b, e) && (a[e] = b[e]);
								return c.prototype = b.prototype,
								a.prototype = new c,
								a.__super__ = b.prototype,
								a
							};
							window.__extends = e,
							window.zTracker = {
								z : 0,
								next : function () {
									return ++this.z
								}
							},
							window.clearPresentations = function () {
								for (var a = localStorage.length, b = 0; a > b; ++b) {
									var c = localStorage.key(b);
									c && -1 != c.indexOf(".strut") && (console.log("Removing: " + c), localStorage.removeItem(c))
								}
							},
							window.log = function (a) {
								log.enabled.log && console.log(a)
							},
							log.enabled = {
								notice : !0,
								err : !0,
								log : !0
							},
							log.err = function (a) {
								log.enabeld.err && console.error(a)
							},
							log.notice = function (a) {
								log.enabled.notice && console.log(a)
							},
							require(["handlebars", "lang", "compiled-templates", "colorpicker", "strut/config/config", "features", "./StrutLoader", "bootstrap", "jqContextMenu", "css!components/jq-contextmenu/jquery.contextMenu.css", "touchpunch", "preview_export/scripts/dataset-shim"], function (a, b, c, d, e, f, g) {
								"use strict";
								var h = window.navigator.userAgent;
								window.browserPrefix = h.indexOf("WebKit") >= 0 ? "-webkit-" : h.indexOf("MSIE") >= 0 ? "-ms-" : h.indexOf("Mozilla") >= 0 ? "-moz-" : "",
								a.registerHelper("either", function (a, b) {
									return null != b ? b : a
								}),
								$.event.special.destroyed = {
									remove : function (a) {
										a.handler && a.handler()
									}
								},
								g.start(f, function () {}, function () {}),
								$(window).unload(function () {
									localStorage.setItem("Strut_sessionMeta", JSON.stringify(window.sessionMeta))
								})
							}),
							define("main", function () {})
						}
							();
