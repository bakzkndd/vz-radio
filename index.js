import { Plugin } from '@vizality/entities';
import { getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher'

const HeaderBarButton = require('./components/HeaderBarButton')

export default class vzradio extends Plugin {
  async start () {
    const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer')
    patch('radio-header-bar', HeaderBarContainer.prototype, 'render', (args, res)=> {
      if (this.settings.get('location') === 'header-bar-container')
        res.props.toolbar.props.children.unshift(<HeaderBarButton settings={this.settings} bartype={HeaderBarContainer.Icon}/>)
      return res
    })
  }

  stop () {
     
  }
}