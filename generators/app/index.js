'use strict';
const yeoman = require('yeoman-generator');
const pack = require('./package.json');
const os = require('os');

module.exports = yeoman.Base.extend({
  default: function () {
    const compose = n => this.composeWith(`react-pack:${n}`, { options: this.props });
    ['react', 'lint', 'babel'].forEach(i => compose(i));
    if (this.props.needTest) {
      compose('test');
    }
  },
  prompting: function () {
    this.log('Welcome to use React/Webpack generator v0.5.3');
    var prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name',
        default: this.appname
      },
      {
        type: 'confirm',
        name: 'needIE8',
        message: 'Is need IE8 compatibility?',
        default: true
      },
      {
        type: 'list',
        name: 'js',
        message: 'Choose javascript language',
        choices: [
          { name: 'Raw JS', value: 'raw' },
          { name: 'Typescript', value: 'ts' },
          { name: 'JS+Flow', value: 'flow' }
        ]
      },
      {
        type: 'list',
        name: 'css',
        message: 'Choose CSS language',
        choices: [
          { name: 'SCSS', value: 'scss' },
          { name: 'Raw CSS', value: 'raw' }
        ]
      },
      {
        type: 'checkbox',
        name: 'tools',
        message: 'Choose other librarys',
        choices: [
          { name: 'Redux', value: 'redux' },
          { name: 'React router', value: 'router' },
          { name: 'CSS modules', value: 'cssmodule' },
        ]
      },
      {
        type: 'confirm',
        name: 'needTest',
        message: 'Is need unit testing ?',
        default: false
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  },
  writing: function () {
    const copy = (a, b = a) => this.fs.copy(this.templatePath(a), this.destinationPath(b));
    const copyTpl = (o, a, b = a) => this.fs.copyTpl(this.templatePath(a), this.destinationPath(b), o);

    const tools = this.props.tools;
    const isRedux = tools.includes('redux');
    const isCSSModule = tools.includes('cssmodule');
    const isRouter = tools.includes('router');
    const o = { isCSSModule, isRedux, isRouter };

    const user = { userName: this.user.git.name() || '', email: this.user.git.email() || '' };
    const d = Object.assign({}, this.props, user);
    this.fs.write(this.destinationPath('package.json'), pack.getPackageJSON(d));
    copy('a.gitignore', '.gitignore');
    copy('app.config.js');
    copyTpl(o, 'webpack.config.js.ejs', 'dev/webpack.config.js');
    copy('dev');
    copy('static');
  },
  install: function () {
    // this.spawnCommand('cnpm', ['install']);
  }
});
