import React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import Link from './Link';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import shortid from 'shortid';

class TableElement extends React.Component {
  setSelectStar() {
    this.props.actions.queryEditorSetSql(this.props.queryEditor, this.selectStar());
  }

  selectStar() {
    let cols = '';
    this.props.table.columns.forEach((col, i) => {
      cols += col.name;
      if (i < this.props.table.columns.length - 1) {
        cols += ', ';
      }
    });
    return `SELECT ${cols}\nFROM ${this.props.table.name}`;
  }

  popSelectStar() {
    const qe = {
      id: shortid.generate(),
      title: this.props.table.name,
      dbId: this.props.table.dbId,
      autorun: true,
      sql: this.selectStar(),
    };
    this.props.actions.addQueryEditor(qe);
  }

  collapseTable(e) {
    e.preventDefault();
    this.props.actions.collapseTable.bind(this, this.props.table)();
  }

  expandTable(e) {
    e.preventDefault();
    this.props.actions.expandTable.bind(this, this.props.table)();
  }

  render() {
    let metadata = null;
    let buttonToggle;
    if (this.props.table.expanded) {
      buttonToggle = (
        <a
          href="#"
          onClick={(e) => { this.collapseTable(e); }}
        >
          <strong>{this.props.table.name}</strong>
          <small className="m-l-5"><i className="fa fa-minus" /></small>
        </a>
      );
      metadata = (
        <div>
          {this.props.table.columns.map((col) => (
            <div className="row">
              <div className="col-sm-8">
                <div className="m-l-5">{col.name}</div>
              </div>
              <div className="col-sm-4">
                <div className="pull-right text-muted"><small>{col.type}</small></div>
              </div>
            </div>
          ))}
          <hr />
        </div>
      );
    } else {
      buttonToggle = (
        <a
          href="#"
          onClick={(e) => { this.expandTable(e); }}
        >
          {this.props.table.name}
          <small className="m-l-5"><i className="fa fa-plus" /></small>
        </a>
      );
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-9 m-b-10">
            {buttonToggle}
          </div>
          <div className="col-sm-3">
            <ButtonGroup className="ws-el-controls pull-right">
              <Link
                className="fa fa-pencil pull-left m-l-2"
                onClick={this.setSelectStar.bind(this)}
                tooltip="Run query in this tab"
                href="#"
              />
              <Link
                className="fa fa-plus-circle pull-left  m-l-2"
                onClick={this.popSelectStar.bind(this)}
                tooltip="Run query in a new tab"
                href="#"
              />
              <Link
                className="fa fa-trash pull-left m-l-2"
                onClick={this.props.actions.removeTable.bind(this, this.props.table)}
                tooltip="Remove from workspace"
                href="#"
              />
            </ButtonGroup>
          </div>
        </div>
        {metadata}
      </div>
    );
  }
}
TableElement.propTypes = {
  table: React.PropTypes.object,
  queryEditor: React.PropTypes.object,
  actions: React.PropTypes.object,
};
TableElement.defaultProps = {
  table: null,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}
export default connect(null, mapDispatchToProps)(TableElement);
