//target CS6
#target "InDesign-8.0"
//target the latest version of InDesign
#target "InDesign"


/*
ÉTAPES
1. sélection du texte
	- If leading auto ; ok
	- If non selection ; ok

2. calcule de la correction
	- proposition alignement (x-Height, Asc, Caps); ok

# Bugs

*/


//DocumentAndBaselineGrids.js
//Creates a document, then sets preferences for the document grid
//and baseline grid.
var myDocument = app.activeDocument;
var myPage = myDocument.pages.item(0);
var thisPage = app.activeWindow.activePage;  

//Set the document measurement units to points.
myDocument.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
myDocument.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;

/* VARIABLES */
var topM = thisPage.marginPreferences.top;
var leftM = thisPage.marginPreferences.left;
var bottomM = thisPage.marginPreferences.bottom;
var rightM = thisPage.marginPreferences.right;
var myPageHeight = myDocument.documentPreferences.pageHeight;
var textBlock = myPageHeight - topM - bottomM;


/* SELECTION */
if (app.documents.length != 0){
	//If the selection contains more than one item, the selection
	//is not text selected with the Type tool.
	if (app.selection.length == 1){
		//Evaluate the selection based on its type.
		switch (app.selection[0].constructor.name){
		case "InsertionPoint":
		case "Character":
		case "Word":
		case "TextStyleRange":
		case "Line":
		case "Paragraph":
		case "TextColumn":
		case "Text":
		case "Story":
			//The object is a text object; pass it on to a function.
			if(app.selection[0].leading == Leading.AUTO){
				alert('L’interlignage est réglé sur «auto».\n La valeur récupérée est ' + (app.selection[0].pointSize*app.selection[0].autoLeading)/100 + ' points.')
				var leading = (app.selection[0].pointSize*app.selection[0].autoLeading)/100;
			} else {			
				var leading = app.selection[0].leading;
			}
			
			// On lance la fonction
			wa75();
		break;

		//In addition to checking for the above text objects, we can
		//also continue if the selection is a text frame selected with
		//the Selection tool or the Direct Selection tool.
		case "Selectionnez du texte et relancez le script":

		//If the selection is a text frame, get a reference to the
		//text in the text frame.
		break;

		default:
			alert("Sélectionnez le texte courant dans ce bloc et relancez le script.");
		break;
		}
		}
			else{
			alert("Sélectionnez le texte courant et relancez le script");
			}
}



function wa75(){

	/* CAP Height calcul*/
	var tf = myPage.textFrames.add ({
		geometricBounds: [0,0,80,80],
		textFramePreferences : {firstBaselineOffset: FirstBaseline.capHeight},
		//textFramePreferences : {firstBaselineOffset: FirstBaseline.ASCENT_OFFSET},
		contents: 'h'
	});
	
	
	var ip = app.selection[0];
	tf.parentStory.appliedFont = ip.appliedFont;
	tf.parentStory.pointSize = ip.parentStory.characters[ip.index-1].pointSize;
	
	var cap_height = tf.characters[0].baseline;
	// tf.textFramePreferences.firstBaselineOffset = FirstBaseline.ASCENT_OFFSET;
	// asc_height = real_asc_height;
	tf.textFramePreferences.firstBaselineOffset = FirstBaseline.xHeight;
	x_height = tf.characters[0].baseline;
	
	// ON VECTORISE LE BLOC
	asc_bloc_Outline = tf.createOutlines(false);
	var outlinedText = asc_bloc_Outline[0];
	
	// ON CALCUL LA TAILLE
	var Bound = outlinedText.geometricBounds;
	var asc_height = Bound[2] - Bound[0];
	
	// ON EFFACE LES BLOCS
	
	outlinedText.remove();
	tf.remove();
		
	
	var offset  = cap_height;
	

	/* ON VERIFIE SI ON EST DÉJA BON */
	function isNumeric(e) {
		return !isNaN(parseFloat(e)) && isFinite(e);
	}
	if( ((textBlock- myDocument.gridPreferences.baselineStart) / ip.leading)  % 1 == 0 ){		
	
			// AUCUNE CORRECTION, on propose de changer le nombre de lignes
				var lineCount = textBlock/leading;
				var lineCountRound =  parseInt(lineCount);

			
				var dialogLine = app.dialogs.add({name:"Nombre de lignes", canCancel:true});
				with(dialogLine){
					//Add a dialog column.
					with(dialogColumns.add()){
						with(dialogRows.add()){
							staticTexts.add({staticLabel:"Votre empagement fait exactement  " + (lineCountRound + 1) + " lignes."});
							
						}
						with(dialogRows.add()){
						staticTexts.add({staticLabel:"Aucune correction n’est nécessaire, mais vous pouvez changez le nombre de lignes."});
						}
				
						//Create another border panel.
						with(borderPanels.add()) {
							// staticTexts.add({staticLabel:"Sur quoi voulez-vous alignment de la première ligne de texte :"});
							var myRadioButtonGroup = radiobuttonGroups.add();
				
							with(myRadioButtonGroup){
								var myMinusTwoLine = radiobuttonControls.add ({staticLabel:lineCountRound - 1 + " (moins 2 ligne)"});
								var myMinusOneLine = radiobuttonControls.add ({staticLabel:lineCountRound + " (moins 1 ligne)"});
								var myBaseLine = radiobuttonControls.add ({staticLabel:lineCountRound + 1 + " (nombre de lignes actuel)", checkedState:true});
								var myPlusOneLine = radiobuttonControls.add ({staticLabel:lineCountRound + 2 + " (plus une ligne)"});
								var myPlusTwoLine = radiobuttonControls.add ({staticLabel:lineCountRound + 3 + " (plus deux ligne)"});
								
							} 
						}
					}
				
				}
				
				//Display the dialog box.
				if(dialogLine.show() == true){
					if(myRadioButtonGroup.selectedButton == 0){
						var lineLength = lineCountRound - 1;
					}else if(myRadioButtonGroup.selectedButton == 1){
						var lineLength  = lineCountRound ;	
					}else if(myRadioButtonGroup.selectedButton == 2){
						var lineLength  = lineCountRound + 1;
					}else if(myRadioButtonGroup.selectedButton == 3){
						var lineLength  = lineCountRound + 2;
					}else if(myRadioButtonGroup.selectedButton == 4){
						var lineLength  = lineCountRound + 3;	
					} else { 
						//Get the point size from the point size field.
						var lineLength = myPointSizeField.editValue;
					}
				
				} else {
					dialogLine.destroy()
				}
		
			var lineCountRound =  parseInt(lineLength);	
	
		} /* FIN CAS 1 */
		else {
			// Sinon on calcul des variables à partir de la sélection
			var lineCount = textBlock/leading;
			var lineCountRound =  parseInt(lineCount);
		} /* FIN CAS 2*/
		

	/* Dialog alignement */
	var myDialog = app.dialogs.add({name:"Alignment de la première ligne", canCancel:true});
	with(myDialog){
		//Add a dialog column.
		with(dialogColumns.add()){

			//Create another border panel.
			with(borderPanels.add()) {
				// staticTexts.add({staticLabel:"Sur quoi voulez-vous alignment de la première ligne de texte :"});
				var myRadioButtonGroup = radiobuttonGroups.add();

				with(myRadioButtonGroup){
					var myXRadioButton = radiobuttonControls.add ({staticLabel:"Hauteur d’x"});
					var myAcsRadioButton = radiobuttonControls.add ({staticLabel:"Ascendante"});
					var myCapRadioButton = radiobuttonControls.add ({staticLabel:"Capitale"});
					var myBaseLineRadioButton = radiobuttonControls.add ({staticLabel:"Ligne de base"});
				} 
			}
			// Add a dialog column.
			with(borderPanels.add()){
				staticTexts.add({staticLabel:"Offset par rapport à la marge supérieure :"});

				//Create a number (real) entry field.
				var myPointSizeField = measurementEditboxes.add({editValue:0, editUnits:MeasurementUnits.millimeters});
			}
		}

	}

	// START Dialogue alignement
	if(myDialog.show() == true){
		if(myRadioButtonGroup.selectedButton == 0){
			var offset  = x_height + myPointSizeField.editValue;
		}else if(myRadioButtonGroup.selectedButton == 1){
			var offset  = asc_height + myPointSizeField.editValue;	
		}else if(myRadioButtonGroup.selectedButton == 2){
			var offset  = cap_height + myPointSizeField.editValue;
		}else if(myRadioButtonGroup.selectedButton == 3){
			var offset  = 0 + myPointSizeField.editValue;
		} else {
			//Get the point size from the point size field.
			var offset = myPointSizeField.editValue;
		}

	}
		else {
			myDialog.destroy()
		}
	// END Dialogue alignement
	
	/* CALCUL CORRECTION LEADING */
	
	var correctedInter = (textBlock - offset)/(lineCountRound-1);
	var correctedInterRound = correctedInter.toFixed(3);

	/* Grid dialog */
	var myGridDialog = app.dialogs.add({name:"Grille", canCancel:false});
	with(myGridDialog){
		//Add a dialog column.
		with(dialogColumns.add()){
			//Create another border panel.
			with(borderPanels.add()){
				with(dialogColumns.add()){
					staticTexts.add({staticLabel:"Afficher la grille de base…"});
				}	
				var myRadioButtonGroup = radiobuttonGroups.add();
				with(myRadioButtonGroup){
					var myPageRadioButton = radiobuttonControls.add ({staticLabel:"sur toute la page"});
					var myGridRadioButton = radiobuttonControls.add ({staticLabel:"au sein des marges", checkedState:true});
				}
			}
		}	
	}

	//Start the grid box.
	if(myGridDialog.show() == true){
	
		if(myRadioButtonGroup.selectedButton == 0){
			// GRILLE PLACÉ PAR RAPPORT À LA PAGE
			with(myDocument.gridPreferences){
				var myInt = topM / correctedInter;
				var newOffset = topM + offset - (myInt.toFixed(0)*correctedInter);	
				baselineStart = newOffset ;
				baselineDivision = correctedInter;
				baselineGridRelativeOption = BaselineGridRelativeOption.TOP_OF_PAGE_OF_BASELINE_GRID_RELATIVE_OPTION;
				baselineColor = UIColors.GRAY;
				baselineViewThreshold = 50;
				baselineShown = true;
				documentGridShown = false;
			}
		
		}else if(myRadioButtonGroup.selectedButton == 1){
			// GRILLE PLACÉ PAR RAPPORT AU BLOC
			with(myDocument.gridPreferences){
				baselineStart = offset ;
				baselineDivision = correctedInter;
				baselineGridRelativeOption = BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION;  
				baselineColor = UIColors.GRAY;
				baselineViewThreshold = 50;
				baselineShown = true;
				documentGridShown = false;
			}

		} else {
			with(myDocument.gridPreferences){
				baselineStart = offset ;
				baselineDivision = correctedInter;
				baselineGridRelativeOption = BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION;  
				baselineColor = UIColors.GRAY;
				baselineViewThreshold = 50;
				baselineShown = true;
				documentGridShown = false;
			}
		}
	
	
	
		}
		else {
		myGridDialog.destroy()
	}
	//End grid box.
	
	// On applique au bloc sélectionné
	var myStory = app.selection[0].paragraphs[0];
		myStory.alignToBaseline = true;
		myStory.leading = correctedInter;
	
		var myTextFrame = app.selection[0].parentTextFrames[0];
	
		//Set the bounds of the text frame.
		myTextFrame.geometricBounds = myGetBounds(myDocument, thisPage);

			
	if ( thisPage.side == PageSideOptions.leftHand ) {
		var aMessage = 'de gauche';
		} else if ( thisPage.side == PageSideOptions.rightHand ) {
			var aMessage = 'de droite';
		} else if ( thisPage.side == PageSideOptions.singleSided ) {
			var aMessage = 'simple';
		}
		
		
		
		
		
}

/* FIN WA75 */



function myGetBounds(myDocument, thisPage){
	var thisPageWidth = myDocument.documentPreferences.pageWidth;
	var thisPageHeight = myDocument.documentPreferences.pageHeight
	
	if(thisPage.side == PageSideOptions.leftHand){
		var myX2 = thisPage.marginPreferences.left;
		var myX1 = thisPage.marginPreferences.right;
	} else {
			var myX1 = thisPage.marginPreferences.left;
			var myX2 = thisPage.marginPreferences.right;
	}
		
	var myY1 = thisPage.marginPreferences.top - x_height;
	var myX2 = thisPageWidth - myX2;
	var myY2 = thisPageHeight - thisPage.marginPreferences.bottom;
	return [myY1, myX1, myY2, myX2];
		
	
	

}




myDocument.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.millimeters;
myDocument.viewPreferences.verticalMeasurementUnits = MeasurementUnits.millimeters;




