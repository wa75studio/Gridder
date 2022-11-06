# Gridder

## Description
Ce script est pensé comme une aide lors de la mise au point d'une grille de ligne de base dans un fichier Indesign. Il permet de l’ajuster et modifier rapidement.
Il est construit sur notre manière de travailler chez [WA75](http://wa75.com), elle-même adossée sur les méthodes de Josef Müller-Brockmann, Jost Hochuli et les modernistes en général.

## Installation
Téléchargez les fichiers du *repository* et copier le fichier `gridder.js` le dans le dossier des scripts d’Indesign.

### Sur Mac OS
`Users/[nom d’utilisateur]/Bibliothèque/Preferences/Adobe InDesign/[version]/[langue]/Scripts/Panneau Scripts`

### Sur Windows (Vista et 7)
`Users\[nom d’utilisateur]\AppData\Roaming\Adobe\InDesign\[version][langue]\Scripts\Scripts Panel`

### Dans Indesign
Vous pouvez également localiser le dossier dans lequel les scripts de l'utilisateur.trice sont situés depuis Indesign.
- lancez Indesign
- ouvrez le panneau Scripts (`Fenêtre > Utilitaires > Scripts`)
- sélectionnez le dossier Utilisateur.
- cliquez sur le menu du panneau Script et sélectionner la fonction `Faire apparaitre dans le Finder`
- organisez librement vos scripts dans le dossier qui s'est ouvert dans le Finder.

Plus d'informations sur le site d'Adobe (https://helpx.adobe.com/fr/Indesign/using/scripting.html)

## Compatibilité
Ce script a été testé avec les versions d'Adobe Indesign CS6 à CC2021.

## Utilisation
> Vous pouvez travailler sur une page normale ou un gabarit. Sachez que les modifications de la grille de ligne de base affecteront le document, donc seront présente sur toutes pages.

L’usage de ce script implique un protocole précis, qui ne conviendra pas à tou.te.s les designers.
Dans un premier temps il vous faudra définir certains réglages manuelement, qui correspondent aux caractéristiques propres à votre projet :

- le réglage du texte courant (choix de la police, corps, interlignage, etc.)
- la définition des marges sur une page type.

À partir de ces deux réglages, le script ré-ajustera la linéature de la grille de ligne de base de manière à ce que la dernière ligne de texte soit parfaitement calée sur la marge de pied

> Attention le script ne fonctionnera pas si l'interlignage est réglé sur `automatique`.

### Options
Lors du calcul deux options sont proposées pour guider l'utilisateur.trice :

**1. Alignement de la première ligne de texte**
- Hauteur d'x [`par défaut`]
- Ascendante
- Capitale
- Ligne de base
- Régalement personnalisé

**2. Afficher la grille de ligne de base**
- Sur toute la page
- Au sein des marges [`par défaut`]

À l'issue du calcul
- L'interlignage sera ajusté de manière à ce la dernière ligne de texte soit calée sur la marge de pied
- le bloc texte occupera tout l'espace compris dans les marges,


### Relancer le script
Si le script est relancé sur un texte déjà ajusté :
- il informera l'utilisateur sur le nombre de lignes actuellement au sein du bloc de composition
- proposera de rerégler l'interlignage de la grille de ligne de base en ajoutant ou supprimant jusqu’à 2 lignes.

Cette opération peut être effectuée plusieurs fois de suite.

## License

GNU General Public License v2.0

## Credits

- [WA75](https://github.com/wa75studio)
