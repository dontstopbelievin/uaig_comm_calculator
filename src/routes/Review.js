import React from 'react';
import $ from 'jquery';
import 'jquery-serializejson';
import { Route, Switch, Redirect} from 'react-router-dom';

export default class Review extends React.Component {
  render() {
    return (
      <div className="content container review-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Отзывы</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/reviews/all" component={AllReviews} />
              <Route path="/reviews/:tag" component={ReviewsByTag} />
              <Redirect from="/reviews" to="/reviews/all" />
            </Switch>
          </div>
        </div>
        
      </div>
    )
  }
}

class AllReviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: []
    }

    this.getReviews = this.getReviews.bind(this);
    this.sendReview = this.sendReview.bind(this);
    this.renderTags = this.renderTags.bind(this);
  }

  getReviews() {
    $.ajax({
      type: 'GET',
      url: window.url + 'api/Review/index',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      success: function (data) {
        this.setState({reviews: data});
      }.bind(this)
    });
  }

  sendReview(e) {
    e.preventDefault();

    var formData = $('#review-form').serializeJSON();

    $.ajax({
      type: 'POST',
      url: window.url + 'api/Review/Add',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      data: JSON.stringify(formData),
      success: function (data) {
        alert("Отзыв успешно добавлен");
        this.getReviews();
      }.bind(this)
    });
  }

  renderTags(text) {
    text = text.replace(/\B#([а-яa-z0-9_-]+)/g, '<a href="#/Reviews/$1" class="review_tag">#$1</a>');
    
    return text;
  }

  componentDidMount() {
    this.getReviews();
  }

  render() {
    var token = sessionStorage.getItem('tokenInfo');

    return (
      <div>
      <ul className="list-group bmd-list-group-sm">
        {this.state.reviews.map(function(review, index) {
          return(
            <a className="list-group-item" key={index}>
              <div className="bmd-list-group-col">
                <p className="list-group-item-heading">{review.UserFirstName} {review.UserLastName}</p>
                <p className="list-group-item-text" dangerouslySetInnerHTML={{__html: this.renderTags(review.Text)}}></p>
              </div>
            </a>
          );
        }.bind(this))}
        </ul>
        {token ? 
        <form id="review-form" onSubmit={this.sendReview}>
          <div className="form-group">
            <label htmlFor="review_text">Текст</label>
            <textarea id="review_text" className="form-control" name="Text"></textarea>
          </div>
          <div className="form-group">
            <input type="submit" className="btn btn-primary" value="Отправить" />
          </div>
        </form>
        : ''}
      </div>
    )
  }
}

class ReviewsByTag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: []
    }

    this.getReviews = this.getReviews.bind(this);
    this.renderTags = this.renderTags.bind(this);
  }

  componentDidMount() {
    this.getReviews();
  }

  componentWillReceiveProps(newProps) {
    this.getReviews(newProps.match.params.tag);
  }

  getReviews(tag = null) {

    if (tag == null) {
      tag = this.props.match.params.tag;
    }

    $.ajax({
      type: 'GET',
      url: window.url + 'api/Review/index/' + tag,
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
      },
      success: function (data) {
        this.setState({reviews: data});
      }.bind(this)
    });
  }

  renderTags(text) {
    text = text.replace(/\B#([а-яa-z0-9_-]+)/g, '<a href="#/Reviews/$1" class="review_tag">#$1</a>');
    
    return text;
  }

  render() {
    return (
      <div>
        <ul className="list-group bmd-list-group-sm">
        {this.state.reviews.map(function(review, index) {
          return(
            <a className="list-group-item" key={index}>
              <div className="bmd-list-group-col">
                <p className="list-group-item-heading">{review.UserFirstName} {review.UserLastName}</p>
                <p className="list-group-item-text" dangerouslySetInnerHTML={{__html: this.renderTags(review.Text)}}></p>
              </div>
            </a>
          );
        }.bind(this))}
        </ul>
      </div>
    )
  }
}