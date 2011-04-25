require 'test_helper'

class LogentriesControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:logentries)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create logentry" do
    assert_difference('Logentry.count') do
      post :create, :logentry => { }
    end

    assert_redirected_to logentry_path(assigns(:logentry))
  end

  test "should show logentry" do
    get :show, :id => logentries(:one).id
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => logentries(:one).id
    assert_response :success
  end

  test "should update logentry" do
    put :update, :id => logentries(:one).id, :logentry => { }
    assert_redirected_to logentry_path(assigns(:logentry))
  end

  test "should destroy logentry" do
    assert_difference('Logentry.count', -1) do
      delete :destroy, :id => logentries(:one).id
    end

    assert_redirected_to logentries_path
  end
end
