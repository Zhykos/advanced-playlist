[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Zhykos/fr.zhykos.youtubecustomfeed">
    <img src="readme-images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">YouTube Custom Feed</h3>

  <p align="center">
    Votre flux vidéo personnalisé
    <br />
    <a href="https://github.com/Zhykos/fr.zhykos.youtubecustomfeed"><strong>Documentation »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Zhykos/fr.zhykos.youtubecustomfeed/issues">Reporter un bug</a>
    ·
    <a href="https://github.com/Zhykos/fr.zhykos.youtubecustomfeed/issues">Proposer une évolution</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table des matières

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## À propos du projet

[![Product Name Screen Shot][product-screenshot]](https://github.com/Zhykos/fr.zhykos.youtubecustomfeed)

YouTube Custom Feed (YCF) est un projet que j'ai imaginé après m'être abonné à des chaines YouTube ayant plusieurs émissions, mais avec certaines qui ne m'intéressent pas.

*YCF* permet de lister vos chaines préférées et d'ajouter des filtres sur les noms des vidéos que vous ne souhaitez pas voir dans votre flux de vidéos.

**ATTENTION** La version 1.0 est une version MVP (produit minimum viable ou Minimum Viable Product), c'est-à-dire qu'elle fonctionne, mais ne propose pas d'interface graphique évoluée ou n'est pas destinée aux utilisateurs lambdas.


<!-- GETTING STARTED -->
## Démarrage

Vous devez récupérer une version de YCF sur votre machine pour l'utiliser.

### Prérequis

1. Vous avez besoin que NodeJS soit installé sur votre machine. Site officiel : https://nodejs.org/

2. Le second prérequis est d'avoir un compte développeur YouTube/Google : https://developers.google.com/youtube/v3/getting-started

3. Il faudra ensuite récupérer une Clé API et un ID client OAuth 2.0 : console.developers.google.com/apis/credentials

### Installation

1. Téléchargez la dernière version : https://github.com/Zhykos/fr.zhykos.youtubecustomfeed/releases

2. Dézipper la version et ouvrez un Terminal dans le dossier.

3. Installez les paquets NPM.
```sh
npm install
```
4. Configurez l'application en modifiant le fichier */public/youtube-custom-feed/parameters.json*. "*clientApiKey*" aura la valeur de votre Clé API. "*clientId*" aura la valeur de votre ID client OAuth 2.0.

5. Ajoutez vos chaines préférées et les filtres (voir le paragraphe ci-dessous).

6. Démarrez l'application.
```sh
nmp start
```

7. Ouvrez un navigateur web à l'adresse http://localhost:3000/



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- ROADMAP -->
## Feuille de route

Ce projet est développé sur mon temps libre et je n'en ai pas énormément...

Vérifiez la page [open issues](https://github.com/Zhykos/fr.zhykos.youtubecustomfeed/issues) pour voir la liste des éveolutions et des bugs.



<!-- CONTRIBUTING -->
## Pour contribuer

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## Licence

Projet distribué avec la licence MIT. Ouvrez le fichier `LICENSE` pour plus d'informations.



<!-- CONTACT -->
## Contact

Thomas Cicognani - [@zhykos](https://twitter.com/zhykos) - github@tomtom.email

Project Link: [https://github.com/Zhykos/fr.zhykos.youtubecustomfeed](https://github.com/Zhykos/fr.zhykos.youtubecustomfeed)



<!-- ACKNOWLEDGEMENTS -->
## Remerciements

* Icons made by Smashicons (https://www.flaticon.com/authors/smashicons) from Flaticon (https://www.flaticon.com/)
* Blacklist and whitelist icons based on Rudez Studio icons (https://www.iconfinder.com/Ruslancorel)
* Template du Readme : https://github.com/othneildrew/Best-README-Template



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Zhykos/repo.svg?style=flat-square
[contributors-url]: https://github.com/Zhykos/repo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Zhykos/repo.svg?style=flat-square
[forks-url]: https://github.com/Zhykos/repo/network/members
[stars-shield]: https://img.shields.io/github/stars/Zhykos/repo.svg?style=flat-square
[stars-url]: https://github.com/Zhykos/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/Zhykos/repo.svg?style=flat-square
[issues-url]: https://github.com/Zhykos/repo/issues
[license-shield]: https://img.shields.io/github/license/Zhykos/repo.svg?style=flat-square
[license-url]: https://github.com/Zhykos/repo/blob/master/LICENSE.txt
[product-screenshot]: readme-images/screenshot.png