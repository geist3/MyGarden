require 'test_helper'

class AnnotsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:annots)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create annot" do
    assert_difference('Annot.count') do
      post :create, :annot => { }
    end

    assert_redirected_to annot_path(assigns(:annot))
  end

  test "should show annot" do
    get :show, :id => annots(:one).id
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => annots(:one).id
    assert_response :success
  end

  test "should update annot" do
    put :update, :id => annots(:one).id, :annot => { }
    assert_redirected_to annot_path(assigns(:annot))
  end

  test "should destroy annot" do
    assert_difference('Annot.count', -1) do
      delete :destroy, :id => annots(:one).id
    end

    assert_redirected_to annots_path
  end
end
