/* DESCRIPTION: Ajust baseline grid */ 

/*
	
		+	Adobe InDesign Version: CS6+
		+	Author: WA75 (Laurent Mészáros)
		+	Date: 7 Nov 2017
		+	Last update: 6 Nov 2022
		
		+	License (GNU v.2)
			Permission is hereby granted, free of charge, to any person obtaining 
			a copy of this software and associated documentation files (the "Software"), 
			to deal in the Software without restriction, including without limitation 
			the rights to use, copy, modify, merge, publish, distribute, sublicense, 
			and/or sell copies of the Software, and to permit persons to whom the 
			Software is furnished to do so, subject to the following conditions:
			The above copyright notice and this permission notice shall be included 
			in all copies or substantial portions of the Software.
			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
			OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
			FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
			THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
			LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
			FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
			DEALINGS IN THE SOFTWARE.
		
*/


//target CS6
#target "InDesign-8.0"
//target the latest version of InDesign
#target "InDesign"


//DocumentAndBaselineGrids.js
//Creates a document, then sets preferences for the document grid
//and baseline grid.
var myDocument = app.activeDocument;
var myPage = myDocument.pages.item(0);
var thisPage = app.activeWindow.activePage;  

//Réglages des unités du document en points
myDocument.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
myDocument.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;

// déclaration des variables
var topM = thisPage.marginPreferences.top;
var leftM = thisPage.marginPreferences.left;
var bottomM = thisPage.marginPreferences.bottom;
var rightM = thisPage.marginPreferences.right;
var myPageHeight = myDocument.documentPreferences.pageHeight;
var textBlock = myPageHeight - topM - bottomM;


/* Vérification de la selection */
if (app.documents.length != 0){
	// Si la sélection contient plus d'un élément, celle-ci n'est pas un texte sélection avec l'outil texte
	if (app.selection.length == 1){
		// Évaluation de la selection selon son type.
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
			// Si l'élément est bien un objet texte, on le passe à la fonction de calcul
			if(app.selection[0].leading == Leading.AUTO){
				alert('L’interlignage est réglé sur «auto».\n La valeur récupérée est ' + (app.selection[0].pointSize*app.selection[0].autoLeading)/100 + ' points.')
				var leading = (app.selection[0].pointSize*app.selection[0].autoLeading)/100;
			} else {			
				var leading = app.selection[0].leading;
			}
			
			// On lance la fonction
			gridder();
		break;
				
		// En cas d'échec, on informe l'utilisateur qu'il faut selectionner du texte.
		case "Selectionnez du texte et relancez le script":

		// Si la selection est le bloc texte, on informe l'utilisateur de selection le texte dans le bloc.
				
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


// fonction de calcul
function gridder(){

	// Calcul de la hauteur des Capitales
	var tf = myPage.textFrames.add ({
		geometricBounds: [0,0,80,80],
		textFramePreferences : {firstBaselineOffset: FirstBaseline.capHeight},
		contents: 'h'
	});
	
	
	var ip = app.selection[0];
	tf.parentStory.appliedFont = ip.appliedFont;
	tf.parentStory.pointSize = ip.parentStory.characters[ip.index-1].pointSize;
	
	var cap_height = tf.characters[0].baseline;
	tf.textFramePreferences.firstBaselineOffset = FirstBaseline.xHeight;
	x_height = tf.characters[0].baseline;
	
	// On vectorise le bloc
	asc_bloc_Outline = tf.createOutlines(false);
	var outlinedText = asc_bloc_Outline[0];
	
	// On calcul la taille du texte.
	var Bound = outlinedText.geometricBounds;
	var asc_height = Bound[2] - Bound[0];
	
	// On efface les blocs créés pour le calcul
	outlinedText.remove();
	tf.remove();
		
	var offset  = cap_height;
	
	function isNumeric(e) {
		return !isNaN(parseFloat(e)) && isFinite(e);
	}
	if( ((textBlock- myDocument.gridPreferences.baselineStart) / ip.leading)  % 1 == 0 ){		
	
			// CAS #1 : aucune correction n'est nécessaire, on propose de changer le nombre de lignes
				var lineCount = textBlock/leading;
				var lineCountRound =  parseInt(lineCount);

			
				var dialogLine = app.dialogs.add({name:"Nombre de lignes", canCancel:true});
				with(dialogLine){
					with(dialogColumns.add()){
						with(dialogRows.add()){
							staticTexts.add({staticLabel:"Votre empagement fait exactement  " + (lineCountRound + 1) + " lignes."});
							
						}
						with(dialogRows.add()){
						staticTexts.add({staticLabel:"Aucune correction n’est nécessaire, mais vous pouvez changez le nombre de lignes."});
						}
				
						with(borderPanels.add()) {
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
				
				//Affichage de la boîte de dialogue.
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
						//Récupération de la valeur personnalisée.
						var lineLength = myPointSizeField.editValue;
					}
				
				} else {
					dialogLine.destroy()
				}
		
			var lineCountRound =  parseInt(lineLength);	
	
		} /* FIN CAS 1 */
		else {
			// CAS #2 : sinon on calcul des variables à partir de la sélection
			var lineCount = textBlock/leading;
			var lineCountRound =  parseInt(lineCount);
		} /* FIN CAS 2*/
		

	/* Construction de la boîte de dialogue de l'alignement de la première ligne de texte */
	var myDialog = app.dialogs.add({name:"Alignment de la première ligne", canCancel:true});
	with(myDialog){
		with(dialogColumns.add()){
			with(borderPanels.add()) {
				var myRadioButtonGroup = radiobuttonGroups.add();

				with(myRadioButtonGroup){
					var myXRadioButton = radiobuttonControls.add ({staticLabel:"Hauteur d’x"});
					var myAcsRadioButton = radiobuttonControls.add ({staticLabel:"Ascendante"});
					var myCapRadioButton = radiobuttonControls.add ({staticLabel:"Capitale"});
					var myBaseLineRadioButton = radiobuttonControls.add ({staticLabel:"Ligne de base"});
				} 
			}
			with(borderPanels.add()){
				staticTexts.add({staticLabel:"Offset par rapport à la marge supérieure :"});
				var myPointSizeField = measurementEditboxes.add({editValue:0, editUnits:MeasurementUnits.millimeters});
			}
		}

	}

	// Affichage de la boîte de dialogue de l'alignement de la première ligne de texte
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
			//Récupération de la valeur personnalisée.
			var offset = myPointSizeField.editValue;
		}

	}
		else {
			myDialog.destroy()
		}
	// Fin de la boîte de dialogue de l'alignement
	
	// Calcul de la correction de l'interlignage.
	
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

// Fin de la fonction WA75



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




