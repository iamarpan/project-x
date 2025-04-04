import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon, XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Card from '../common/Card';

// Question types enum
const QUESTION_TYPES = {
  TEXT: 'text',
  MULTIPLE_CHOICE: 'multiple_choice',
  VIDEO: 'video',
};

// Initial question template
const getEmptyQuestion = (type = QUESTION_TYPES.TEXT) => ({
  id: Date.now().toString(),
  type,
  text: '',
  options: type === QUESTION_TYPES.MULTIPLE_CHOICE ? ['', ''] : [],
  timeLimit: type === QUESTION_TYPES.VIDEO ? 60 : null, // Default 60 seconds for video
  required: true,
});

// Validation Schema
const validationSchema = Yup.object().shape({
  templateName: Yup.string().required('Template name is required'),
  description: Yup.string(),
  questions: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required('Question text is required'),
      options: Yup.array().when('type', {
        is: QUESTION_TYPES.MULTIPLE_CHOICE,
        then: () => Yup.array()
          .of(Yup.string().required('Option cannot be empty'))
          .min(2, 'At least 2 options are required'),
      }),
      timeLimit: Yup.number().when('type', {
        is: QUESTION_TYPES.VIDEO,
        then: () => Yup.number()
          .required('Time limit is required for video questions')
          .min(10, 'Minimum time limit is 10 seconds')
          .max(300, 'Maximum time limit is 300 seconds'),
      }),
    })
  ).min(1, 'At least one question is required'),
});

const InterviewTemplateBuilder = ({ onSave, initialTemplate = null }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const initialValues = initialTemplate || {
    templateName: '',
    description: '',
    questions: [getEmptyQuestion()],
  };

  const handleSubmit = (values) => {
    onSave(values);
  };

  const reorderQuestions = (result, formikHelpers) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    const questions = Array.from(formikHelpers.values.questions);
    const [removed] = questions.splice(source.index, 1);
    questions.splice(destination.index, 0, removed);
    
    formikHelpers.setFieldValue('questions', questions);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialTemplate ? 'Edit Interview Template' : 'Create New Interview Template'}
        </h2>
        <Button 
          variant="outline" 
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
        </Button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, handleChange }) => (
          <Form>
            <Card className="mb-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <Field
                    type="text"
                    id="templateName"
                    name="templateName"
                    disabled={isPreviewMode}
                    className="form-input"
                  />
                  {errors.templateName && touched.templateName && (
                    <p className="mt-1 text-sm text-red-600">{errors.templateName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={3}
                    disabled={isPreviewMode}
                    className="form-input"
                  />
                </div>
              </div>
            </Card>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Interview Questions</h3>
              
              <DragDropContext onDragEnd={(result) => reorderQuestions(result, { values, setFieldValue })}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      <FieldArray name="questions">
                        {({ push, remove }) => (
                          <>
                            {values.questions.map((question, index) => (
                              <Draggable 
                                key={question.id} 
                                draggableId={question.id} 
                                index={index}
                                isDragDisabled={isPreviewMode}
                              >
                                {(provided) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="relative"
                                  >
                                    {!isPreviewMode && (
                                      <>
                                        <div 
                                          {...provided.dragHandleProps}
                                          className="absolute right-12 top-6 cursor-move"
                                        >
                                          <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => remove(index)}
                                          className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
                                        >
                                          <XMarkIcon className="h-5 w-5" />
                                        </button>
                                      </>
                                    )}

                                    <div className="space-y-4">
                                      {!isPreviewMode && (
                                        <div className="flex space-x-4 mb-4">
                                          <select
                                            value={question.type}
                                            onChange={(e) => {
                                              const newType = e.target.value;
                                              const updatedQuestion = {
                                                ...question,
                                                type: newType,
                                                options: newType === QUESTION_TYPES.MULTIPLE_CHOICE ? ['', ''] : [],
                                                timeLimit: newType === QUESTION_TYPES.VIDEO ? 60 : null,
                                              };
                                              setFieldValue(`questions[${index}]`, updatedQuestion);
                                            }}
                                            className="form-input"
                                          >
                                            <option value={QUESTION_TYPES.TEXT}>Text Response</option>
                                            <option value={QUESTION_TYPES.MULTIPLE_CHOICE}>Multiple Choice</option>
                                            <option value={QUESTION_TYPES.VIDEO}>Video Response</option>
                                          </select>
                                          
                                          <div className="flex items-center">
                                            <Field
                                              type="checkbox"
                                              name={`questions[${index}].required`}
                                              id={`questions[${index}].required`}
                                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`questions[${index}].required`} className="ml-2 block text-sm text-gray-700">
                                              Required
                                            </label>
                                          </div>
                                        </div>
                                      )}

                                      <div>
                                        <label 
                                          htmlFor={`questions[${index}].text`} 
                                          className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                          Question {index + 1} {question.required && isPreviewMode && <span className="text-red-500">*</span>}
                                        </label>
                                        <Field
                                          type="text"
                                          name={`questions[${index}].text`}
                                          id={`questions[${index}].text`}
                                          disabled={isPreviewMode}
                                          placeholder="Enter your question here"
                                          className="form-input"
                                        />
                                        {errors.questions?.[index]?.text && touched.questions?.[index]?.text && (
                                          <p className="mt-1 text-sm text-red-600">{errors.questions[index].text}</p>
                                        )}
                                      </div>

                                      {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Options
                                          </label>
                                          <FieldArray name={`questions[${index}].options`}>
                                            {({ push: pushOption, remove: removeOption }) => (
                                              <div className="space-y-2">
                                                {question.options.map((option, optionIndex) => (
                                                  <div key={optionIndex} className="flex items-center">
                                                    {isPreviewMode ? (
                                                      <div className="flex items-center mb-2">
                                                        <input
                                                          type="radio"
                                                          name={`preview-${index}`}
                                                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                                        />
                                                        <span className="ml-2">{option || `Option ${optionIndex + 1}`}</span>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        <Field
                                                          type="text"
                                                          name={`questions[${index}].options[${optionIndex}]`}
                                                          placeholder={`Option ${optionIndex + 1}`}
                                                          className="form-input"
                                                        />
                                                        {question.options.length > 2 && (
                                                          <button
                                                            type="button"
                                                            onClick={() => removeOption(optionIndex)}
                                                            className="ml-2 text-gray-400 hover:text-red-500"
                                                          >
                                                            <XMarkIcon className="h-4 w-4" />
                                                          </button>
                                                        )}
                                                      </>
                                                    )}
                                                  </div>
                                                ))}
                                                {!isPreviewMode && (
                                                  <button
                                                    type="button"
                                                    onClick={() => pushOption('')}
                                                    className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                                                  >
                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                    Add Option
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                          </FieldArray>
                                          {errors.questions?.[index]?.options && touched.questions?.[index]?.options && (
                                            <p className="mt-1 text-sm text-red-600">
                                              {typeof errors.questions[index].options === 'string' 
                                                ? errors.questions[index].options 
                                                : 'All options must be filled'}
                                            </p>
                                          )}
                                        </div>
                                      )}

                                      {question.type === QUESTION_TYPES.VIDEO && (
                                        <div>
                                          <label 
                                            htmlFor={`questions[${index}].timeLimit`} 
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                          >
                                            Time Limit (seconds)
                                          </label>
                                          <Field
                                            type="number"
                                            name={`questions[${index}].timeLimit`}
                                            id={`questions[${index}].timeLimit`}
                                            min="10"
                                            max="300"
                                            disabled={isPreviewMode}
                                            className="form-input w-32"
                                          />
                                          {errors.questions?.[index]?.timeLimit && touched.questions?.[index]?.timeLimit && (
                                            <p className="mt-1 text-sm text-red-600">{errors.questions[index].timeLimit}</p>
                                          )}
                                          {isPreviewMode && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                              <p className="text-sm text-gray-500">
                                                {question.timeLimit} seconds to record your answer
                                              </p>
                                              <div className="mt-2">
                                                <Button variant="secondary" size="sm" disabled>
                                                  Start Recording
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </Card>
                                )}
                              </Draggable>
                            ))}
                            
                            {!isPreviewMode && (
                              <div className="mt-4">
                                <Button 
                                  type="button"
                                  variant="outline"
                                  onClick={() => push(getEmptyQuestion())}
                                  className="w-full py-3"
                                >
                                  <PlusIcon className="h-5 w-5 mr-2" />
                                  Add Question
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </FieldArray>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              {errors.questions && typeof errors.questions === 'string' && (
                <p className="mt-2 text-sm text-red-600">{errors.questions}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPreviewMode}>
                Save Template
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InterviewTemplateBuilder; 