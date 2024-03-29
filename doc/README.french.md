[![Workflow][workflow-shield]][workflow-url]
[![Coverage][coverage-shield]][workflow-url]
[![MIT License][license-shield]][license-url]
[![Issues][issues-shield]][issues-url]

[![Stable release][release-stable-shield]][release-url]
[![Draft release][release-draft-shield]][release-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Zhykos/advanced-playlist">
    <img src="../doc/images/logo.png" alt="Logo" width="80" height="80" />
  </a>

  <h3 align="center">Video Custom Feed</h3>

  <p align="center">
    <i>VCF</i> : votre flux vidéo personnalisé
    <br />
    <img src="../doc/images/france.png" alt="France" width="16" /> <a href="https://github.com/Zhykos/advanced-playlist/blob/latest/doc/README.french.md"><strong>Documentation en français »</strong></a>
    <br />
    <img src="../doc/images/uk.png" alt="English" width="16" /> <a href="https://github.com/Zhykos/advanced-playlist/blob/latest/README.md"><strong>English documentation »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Zhykos/advanced-playlist/issues">Reporter un bug</a>
    ·
    <a href="https://github.com/Zhykos/advanced-playlist/issues">Proposer une évolution</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table des matières

* [À propos du projet](#à-propos-du-projet)
* [Commencer à utiliser *VCF*](#commencer-à-utiliser-vcf)
  * [Prérequis](#prérequis)
  * [Installation](#installation)
* [Utilisation de *VCF*](#utilisation-de-vcf)
* [Feuille de route](#feuille-de-route)
* [Contribuer au projet](#contribuer-au-projet)
* [Licence](#licence)
* [Contact](#contact)
* [Remerciements](#remerciements)
* [F.A.Q.](#faq)
* [Lancer les tests](#lancer-les-tests)



<!-- ABOUT THE PROJECT -->
## À propos du projet

![Product screenshot](../doc/images/client-guide-00.jpg)

Video Custom Feed (*VCF* en abrégé) est un projet que j'ai imaginé après m'être abonné à des chaines YouTube ayant plusieurs émissions, mais dont certaines qui ne m'intéressaient pas.

*VCF* permet de lister vos chaines préférées et d'ajouter des filtres sur les noms des vidéos que vous ne souhaitez pas voir dans votre flux de vidéos.

**ATTENTION** : la version 1.0 est une version *MVP* (produit minimum viable ou *Minimum Viable Product*), c'est-à-dire qu'elle fonctionne, mais ne propose pas d'interface graphique évoluée ou n'est pas destinée aux utilisateurs lambdas.

**ATTENTION 2** : je ne suis pas un développeur Javascript, certaines fonctionnalités ne sont sûrement pas codées correctement...

Application *developed with YouTube* : https://www.youtube.com

![Developed with YouTube](../doc/images/developed-with-youtube-sentence-case-dark.png)




<!-- GETTING STARTED -->
## Commencer à utiliser *VCF*

Vous devez récupérer une version de *VCF* sur votre machine pour l'utiliser.

### Prérequis

1. Vous avez besoin que NodeJS soit installé sur votre machine. Site officiel : https://nodejs.org/

2. Le second prérequis est d'avoir un compte développeur YouTube/Google : https://developers.google.com/youtube/v3/getting-started

3. Il faudra ensuite récupérer une Clé API Google et un ID client OAuth 2.0 : https://console.developers.google.com/apis/credentials

Écran de la console Google où on récupère ces clés :

![Guide 17](../doc/images/client-guide-17.jpg)


### Installation

1. Téléchargez la dernière version de *VCF* : https://github.com/Zhykos/advanced-playlist/releases

2. Dézipper la version et ouvrez un Terminal dans le dossier.

3. Installez les paquets NPM.
```sh
npm install
```
4. Configurez l'application en modifiant le fichier "*src/etc/apikeys.json*" : "*clientApiKey*" aura la valeur de votre Clé API ; "*clientId*" aura la valeur de votre ID client OAuth 2.0.

5. Ajoutez vos chaines préférées et les filtres (voir le paragraphe ci-dessous).

6. Démarrez l'application.
```sh
nmp start
```

7. Ouvrez un navigateur web à l'adresse http://localhost:3000/



<!-- USAGE EXAMPLES -->
## Utilisation de *VCF*

**ATTENTION** : la version 1.0 est destinée à un public habitué au développement.

### Configuration

La configuration se fait dans le fichier "*src/etc/channels.json*". Il s'agit d'un fichier au format JSON. Soyez sûr que la syntaxe soit correcte pour le bon fonctionnement de l'application.

#### Ajouter une chaîne

Tout d'abord, récupérez l'identifiant de la chaîne que vous souhaitez ajouter. Rendez-vous sur YouTube, sur la page de la chaîne. L'identifiant se trouve dans l'URL :

![YouTube channel](../doc/images/youtube-channel.jpg)

Dans le fichier JSON, dans le nœud *channels*, ajoutez un nouvel objet avec un attribut *id* :

```json
"channels" : [
        {
            "id": "UCWJHqzXc7rKO7h5TzYYBNFw" // zhykos channel
        },
        {
            "id": "<another-channel-id>"
        }
    ]
```

#### Liste blanche

La liste blanche permet de filtrer les vidéos d'une chaîne spécifique. Seules les vidéos répondant aux filtres de la liste blanche seront affichées. La liste blanche est appliquée avant la liste noire (plus de détails ci-dessous pour cette dernière).

Les syntaxes de filtres seront détaillées dans un paragraphe dédié.

Pour appliquer une liste blanche, ajoutez l'élément suivant dans le fichier JSON :

```json
"channels" : [
        {
            "id": "UCWJHqzXc7rKO7h5TzYYBNFw", // zhykos channel
            "whitelist": [
              <my-filters>
            ]
        }
    ]
```

#### Liste noire

La liste noire permet de filtrer les vidéos d'une chaîne spécifique. Les vidéos répondant aux filtres ne seront pas affichées. La liste noire est appliquée après la liste blanche, peu importe sa place dans le fichier JSON.

Les syntaxes de filtres seront détaillées dans un paragraphe dédié.

Pour appliquer une liste noire, ajoutez l'élément suivant dans le fichier JSON :

```json
"channels" : [
        {
            "id": "UCWJHqzXc7rKO7h5TzYYBNFw", // zhykos channel
            "blacklist": [
              <my-filters>
            ]
        }
    ]
```

#### Avoir les listes blanches et noires

Il est tout à fait possible d'avoir les deux possibilités de filtres.

**RAPPEL** : la liste blanche sera appliquée avant la liste noire, peu importe le positionnement dans le fichier JSON.

```json
"channels" : [
        {
            "id": "UCWJHqzXc7rKO7h5TzYYBNFw", // zhykos channel
            "whitelist": [
              <my-filters>
            ],
            "blacklist": [
              <my-filters>
            ]
        }
    ]
```

#### Syntaxe des filtres

Les filtres, que ce soit pour la liste blanche ou noire, sont identiques. À l'heure actuelle, il n'y a que deux filtres possibles :
* Filtre sur le nom de la vidéo ;
* Filtre sur la durée de la vidéo.

##### Filtrer un nom

Utilisez l'attribut "*videoTitle*", l'opérateur "*=~*" et une expression régulière (compatible avec Javascript) :

```json
"channels" : [
        {
            "id": "UCWJHqzXc7rKO7h5TzYYBNFw", // zhykos channel
            "blacklist": [
              "videoTitle=~.+Sentinels.+"
            ]
        }
    ]
```

##### Filtrer une durée "supérieure strictement à"

Utilisez l'attribut "*videoDuration*", l'opérateur "*>*" et une expression spécifique au format YouTube (exemple : 8H22M pour 8 heures et 22 minutes) :

```json
"channels" : [
        {
            "id": "UCWJHqzXc7rKO7h5TzYYBNFw", // zhykos channel
            "blacklist": [
              "videoDuration>8H22M"
            ]
        }
    ]
```

### Utilisation dans le navigateur web

*Note* : L'interface n'est actuellement disponible qu'en anglais.

#### Première utilisation

Lors de votre première utilisation, l'interface sera vide.

![Guide 01](../doc/images/client-guide-01.jpg)

L'application utilise l'API de YouTube pour récupérer des informations sur la plateforme de vidéos, d'après votre configuration précisée dans le fichier JSON.

Connectez-vous à votre compte YouTube/Google avec lequel vous avez généré vos identifiants ajoutés dans le fichier JSON.

![Guide 02](../doc/images/client-guide-02.jpg)

![Guide 03](../doc/images/client-guide-03.jpg)

Une fois la connexion réussie, vous pouvez récupérer les informations depuis YouTube. Celles-ci seront enregistrées dans une base de données interne à l'application (un gros fichier JSON).

![Guide 04](../doc/images/client-guide-04.jpg)

Il n'y a actuellement aucun moyen de savoir si la récupération a fonctionné. Ouvrez la console développeur (généralement avec le raccourci F12) pour vérifier si cela a fonctionné.

![Guide 05](../doc/images/client-guide-05.jpg)

Rafraîchissez la page pour voir apparaître vos vidéos.

![Guide 06](../doc/images/client-guide-06.jpg)

#### Afficher les vidéos cachées

Les filtres permettent de cacher les vidéos que l'on souhaite ne pas voir dans votre flux. Cependant, on peut avoir envie de vérifier si les filtres ont bien fonctionné.

On peut passer à l'affichage complet via le lien dédié.

![Guide 07](../doc/images/client-guide-07.jpg)

Les vidéos filtrées apparaissent en gris.

![Guide 08](../doc/images/client-guide-08.jpg)

Le lien en haut à gauche permet de cacher à nouveau les vidéos filtrées.

![Guide 09](../doc/images/client-guide-09.jpg)

#### Afficher les vidéos d'une chaîne spécifique

Il est possible de n'afficher les vidéos que d'une seule chaîne, avec les filtres associés.

![Guide 10](../doc/images/client-guide-10.jpg)

Le menu à gauche permet de passer d'une chaîne à l'autre ou d'afficher toutes les chaînes.

La chaîne sélectionnée est spécifiée dans le libellé en haut de la page.

![Guide 11](../doc/images/client-guide-11.jpg)

#### Menu vidéo

Chaque vidéo a un menu spécifique pour la regarder ou changer ses attributs.

![Guide 12](../doc/images/client-guide-12.jpg)

Explication des icônes, de gauche à droite :
<ul>
<li><img src="../src/bin/client/images/play.png" alt="Play" width="12" /> Lecture de la vidéo. La vidéo s'affichera en haut de la page ;</li>
<li><img src="../src/bin/client/images/play-hide.png" alt="Play then hide" width="12" /> Lecture de la vidéo. La vidéo s'affichera en haut de la page. La vidéo sera également modifiée pour ne plus apparaître dans votre flux ;</li>
<li><img src="../src/bin/client/images/hide.png" alt="Hide" width="12" /> La vidéo est modifiée pour ne plus apparaître dans votre flux ;</li>
<li><img src="../src/bin/client/images/open-website.png" alt="Website" width="12" /> Lecture de la vidéo sur son site.</li>
</ul>

Vidéo ouverte dans le navigateur : 

![Guide 13](../doc/images/client-guide-13.jpg)

Vous pouvez fermer la vidéo via le lien en dessous :

![Guide 14](../doc/images/client-guide-14.jpg)

Dans le cas où vous avez vous-même caché une vidéo, il est possible de la rendre à nouveau visible à l'aide de l'icône <img src="../src/bin/client/images/visible.png" alt="Visible" width="12" />.

Attention, cette fonctionnalité n'est disponible que si vous affichez les vidéos cachées.

![Guide 15](../doc/images/client-guide-15.jpg)

#### Icônes des filtres pour la liste blanche ou noire

Dans le cas où vous affichez toutes les vidéos, une icône peut être visible pour comprendre si la vidéo correspond à un filtre de liste blanche ou de liste noire. Actuellement aucun détail précis n'est disponible.

<ul>
<li><img src="../src/bin/client/images/blacklist.png" alt="Blacklist" /> Cette vidéo a été filtrée par une liste noire ;</li>
<li><img src="../src/bin/client/images/whitelist.png" alt="Whitelist" /> Cette vidéo a été filtrée par une liste blanche.</li>
</ul>

Exemple de filtrage par liste noire :

![Guide 16](../doc/images/client-guide-16.jpg)

#### Fichier de configuration utilisé pour cet exemple

Le fichier est disponible à : "*tests/resources/tests-parameters.json*".


### Mise à jour des données

Cette version 1.0 demande d'éteindre l'application, puis de la redémarrer après modification du fichier de configuration JSON.

De même, lorsque vous récupérez à nouveau des informations depuis YouTube, rafraîchissez votre page pour voir apparaître les nouvelles vidéos.

Enfin, sachez que l'API YouTube contient des limitations quant au nombre d'informations récupérables. Vérifiez votre console Google/YouTube pour plus de détails.

<!-- ROADMAP -->
## Feuille de route

Ce projet est développé sur mon temps libre et je n'en ai pas énormément...

Vérifiez la page [open issues](https://github.com/Zhykos/advanced-playlist/issues) pour voir la liste des évolutions et des bugs.



<!-- CONTRIBUTING -->
## Contribuer au projet

Vos contributions font que la communauté *open source* est un endroit incroyable pour apprendre (je ne suis moi-même pas du tout développeur JS ou Node), créer et partager. Toute contribution sera grandement appréciée, d'autant plus que je n'ai que très peu de temps à m'y consacrer.

1. *Forkez* le projet
2. Créez une branche pour la correction ou fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. *Commitez* vos modifications (`git commit -m 'Add some AmazingFeature'`)
4. Poussez la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une *Pull Request* sur la page Github du projet



<!-- LICENSE -->
## Licence

Projet distribué avec la licence MIT. Ouvrez le fichier `LICENSE` pour plus d'informations.



<!-- CONTACT -->
## Contact

Thomas Cicognani - [@zhykos](https://twitter.com/zhykos) - github@tomtom.email

Lien du projet : [https://github.com/Zhykos/advanced-playlist](https://github.com/Zhykos/advanced-playlist)



<!-- ACKNOWLEDGEMENTS -->
## Remerciements

* YouTube ™ bien entendu ! 
* Icônes vidéo par Smashicons sur Flaticon : https://www.flaticon.com/authors/smashicons
* Icônes *blacklist* et *whitelist* par Rudez Studio : https://www.iconfinder.com/Ruslancorel
* *Template* du Readme : https://github.com/othneildrew/Best-README-Template
* Icônes des pays par Wikipédia : https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Accueil_principal
* Logo principal d'après des icônes faites par <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> sur <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>



## F.A.Q.

### Le port 3000 est déjà utilisé par une autre application, comment le changer ?

Ouvrez le fichier "*src/bin/server/javascripts/main-express.js*" et modifiez la variable `var port = 3000;` avec le numéro de port que vous souhaitez utiliser.

### À quoi correspond le fichier GPG dans les *Releases* ?

Il s'agit d'un fichier chiffré et signé avec ma clé GPG publique (voir question suivante).
Vous pouvez juste télécharger ce fichier, le vérifier et extraire le zip de celui-ci.

### Où se trouve la clé publique pour vérifier la signature du fichier zip ?

Ici : "https://www.zhykos.fr/Thomas-Cicognani_0x70FD2EF8_public.asc"11


## Lancer les tests

Si vous souhaitez lancer les tests, installez :
  1. Chrome : https://www.google.com/intl/fr_fr/chrome/
  2. Firefox : https://www.mozilla.org/fr/firefox/new/

Vos versions de Chrome et de Firefox doivent être synchrones avec les versions des Drivers Selenium précisés dans le fichier *package.json*.
Ensuite si votre fichier de configuration *apikeys.json* n'est pas complet, vous pouvez surcharger les variables dans un terminal via les commandes :
```shell
export CLIENT_API_KEY=<VALUE>
export CLIENT_ID=<VALUE>
```
Enfin lancer les tests à l'aide de npm :
```shell
npm run chrome-tests
```
(ou remplacer *chrome* par *firefox* selon votre préférence).


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Zhykos/advanced-playlist.svg?style=for-the-badge
[contributors-url]: https://github.com/Zhykos/advanced-playlist/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Zhykos/advanced-playlist.svg?style=for-the-badge
[forks-url]: https://github.com/Zhykos/advanced-playlist/network/members
[stars-shield]: https://img.shields.io/github/stars/Zhykos/advanced-playlist.svg?style=for-the-badge
[stars-url]: https://github.com/Zhykos/advanced-playlist/stargazers
[issues-shield]: https://img.shields.io/github/issues/Zhykos/advanced-playlist.svg?style=for-the-badge&logo=GitHub&label=bugs
[issues-url]: https://github.com/Zhykos/advanced-playlist/issues
[license-shield]: https://img.shields.io/github/license/Zhykos/advanced-playlist.svg?style=for-the-badge&label=LICENCE
[license-url]: https://github.com/Zhykos/advanced-playlist/blob/master/LICENSE.txt
[workflow-shield]: https://img.shields.io/github/workflow/status/Zhykos/advanced-playlist/CI?style=for-the-badge&logo=Node.js
[workflow-url]: https://github.com/Zhykos/advanced-playlist/actions/workflows/node.js.yml
[coverage-shield]: https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/Zhykos/1e17cccbecd6e44805d33ee6a300e44b/raw/advanced-playlist-coverage-latest.json&label=COUVERTURE
[release-stable-shield]: https://img.shields.io/github/v/release/Zhykos/advanced-playlist?style=for-the-badge&logo=YouTubeStudio
[release-url]: https://github.com/Zhykos/advanced-playlist/releases
[release-draft-shield]: https://img.shields.io/badge/Release-DRAFT-orange?style=for-the-badge