import React from 'react'
import { connect } from 'react-redux'
import classes from './AutodeskLocalViewer.css'
import autodeskViewerUtils from '../PreviewCadViewer.utils.js'

const AutodeskLocalViewer = React.createClass({
  viewer: null,
  onMount (nextProps, prevProps) {
    if(!prevProps || nextProps.path != prevProps.path){
      // deregister the viewer if it already exists.
      if(this.viewer && this.viewer.deregister){
        this.viewer.deregister();
      }
      this.viewer = autodeskViewerUtils.register(this.refs.cadCanvas, nextProps.linkKey);
      const filePath = `${nextProps.path}/1/model.svf`;
      const filePathWithProtocol = filePath.startsWith('http') ? filePath : `file://${filePath}`;


      const options = {
        env: 'Local',
        document: filePathWithProtocol,
        svfHeaders: {},
      }

      if (nextProps.auth.authToken) {
        // Headers for the svf requests (only required for the website)
        // This feature is a modification of the Autodesk source code
        // It will break whenever the source is updated.
        // There is a readme in the autodesk viewer folder explaining the changes

        // NOTE: there is some risk that the bearer token will be sent to Autodesk?
        options.svfHeaders.Authorization = `bearer ${nextProps.auth.authToken}`
      }

      Autodesk.Viewing.Initializer(options, () => {
        this.viewer.start(options.document, options);
      });

    }
  },
  componentDidMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  componentWillUnmount(){
    this.viewer.deregister();
  },
  render() {
    return <div className={classes.preview + ' flex rel-box'} ref="cadCanvas"><div className={classes.scrollOverlay}></div></div>
  }
})

export default connect(({ auth }) => ({ auth }))(AutodeskLocalViewer)
