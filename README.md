# Gridder

## Description
Ce script est pensé comme une aide lors de la mise au point de grille de ligne de base dans un fichier indesign, afin de les *corriger* et modifier rapidement.
Il est construit sur notre manière de travailler chez [WA75](http://wa75.com), elle-même adossée sur les méthodes de Josef Müller-Brockmann, Jost Hochuli et les modernes suisses en générale.

## Installation
Téléchargez les fichiers du *repository* et copier le dans le dossier des scripts de inDesign.

### Sur Mac OS
`Users/[nom d’utilisateur]/Bibliothèque/Preferences/Adobe InDesign/[version]/[langue]/Scripts/Panneau Scripts`

### Sur Windows (Vista et 7)
`Users\[nom d’utilisateur]\AppData\Roaming\Adobe\InDesign\[version][langue]\Scripts\Scripts Panel`


Vous pouvez également localiser le dossier dans lequel les scripts de l'utilisateur à partir de Indesign.
- Lancez Indesign
- ouvrez le panneaux Scripts (`Fenêtre > Utilitaires > Scripts`)
- selectionnez le dossier Utilisateur.
- Cliquez sur le menu du panneau Script et sélectionner la fonction `Faire apparaître dans le Finder`
- Organisez librement vos scripts dans le dossier qui s'est ouvert dans le Finder.

Plus d'informations sur le site d'Adobe (https://helpx.adobe.com/fr/indesign/using/scripting.html)

## Compatibilité
Ce script a été testé avec les versions d'Adobe inDesign CS6 à CC 2021.

## Utilisation
L’usage de script implique un protocole précis, qui ne conviendra pas à tou.te.s les designer, il a été essentielement imaginé pour que le processus de calage de la mise en page soit plus souple.

Dans un premier temps il vous faudra manuelement effectuer :

- Le réglage du texte courant
- La définition des marges

à partir de ces deux réglages, le script ré-ajustera la linéature de la grille de ligne de base de manière à ce qu'elle soient parfaitement calée par rapport aux marges de tête et de pied.

- De manière à obtenir des drapeaux sans mots courts en bout de ligne, il remplace les espaces les suivants par une espace insécable (`&nbsp;`), Ceux-ci se retrouvent ainsi en début de ligne.
- Il remplace certains caractères par les glyphes appropriés (signe multiplié, abréviation de numéro, etc.)
- Il corrige des mésusages de ponctuaction (trois points, exposants de mètres carrés ou des siècles, etc.)

Le paramètre `$nowrap` permet de de choisir la longueur des mots à coller au suivant.

Il est possible de rajouter des règles dans le fichier `patterns.json`, situé dans le dossier `assets`.


## License

GNU v.2

## Credits

- [WA75](https://github.com/wa75studio)
